import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../styles/theme';

import { auth } from '../config/firebase';

import { buscarAgendamentos } from '../services/agendamento';

import {
  criarNotificacoesGerais,
  salvarNotificacao,
} from '../services/notificacaoService';


export default function Home({ navigation }) {

  const [mostrarPermissao, setMostrarPermissao] =
    useState(false);

  const [mostrarAviso, setMostrarAviso] =
    useState(false);

  const posicaoAviso = useRef(
    new Animated.Value(0)
  ).current;

  const [avisos, setAvisos] =
    useState([]);

  const [avisoAtual, setAvisoAtual] =
    useState(0);

  useEffect(() => {
    iniciarNotificacoes();
  }, []);


  async function iniciarNotificacoes() {

    try {

      const permissao =
        await AsyncStorage.getItem(
          '@petlover_permissao_notificacoes'
        );


      // Primeira vez usando o sistema
      if (permissao === null) {

        setMostrarPermissao(true);

        return;
      }


      // Usuário permitiu anteriormente
      if (permissao === 'sim') {

        await carregarAvisos();
      }

    } catch (error) {

      console.log(
        'Erro ao iniciar notificações:',
        error
      );

    }
  }

  async function aceitarNotificacoes() {

    try {

      await AsyncStorage.setItem(
        '@petlover_permissao_notificacoes',
        'sim'
      );

      setMostrarPermissao(false);

      await carregarAvisos();

    } catch (error) {

      console.log(
        'Erro ao salvar permissão:',
        error
      );

    }
  }

  async function recusarNotificacoes() {

    try {

      await AsyncStorage.setItem(
        '@petlover_permissao_notificacoes',
        'nao'
      );

      setMostrarPermissao(false);

    } catch (error) {

      console.log(
        'Erro ao salvar resposta:',
        error
      );

    }
  }

  async function carregarAvisos() {

    try {

      const usuario =
        auth.currentUser;


      if (!usuario) {
        return;
      }

      await criarNotificacoesGerais(
        usuario.uid
      );

      const resultado =
        await buscarAgendamentos(
          usuario.uid
        );


      const listaAvisos = [];

      if (
        resultado.sucesso &&
        resultado.agendamentos?.length
      ) {

        const agora =
          new Date();


        const agendamentos =
          resultado.agendamentos
            .map((agendamento) => {

              let data;


              if (
                agendamento.data &&
                typeof agendamento.data.toDate ===
                  'function'
              ) {

                data =
                  agendamento.data.toDate();

              } else {

                data =
                  new Date(
                    agendamento.data
                  );
              }


              return {
                ...agendamento,
                dataConvertida: data,
              };

            })
            .filter((agendamento) => {

              return (
                !Number.isNaN(
                  agendamento.dataConvertida.getTime()
                ) &&
                agendamento.dataConvertida >= agora
              );

            })
            .sort((a, b) => {

              return (
                a.dataConvertida.getTime() -
                b.dataConvertida.getTime()
              );

            });


        const proximo =
          agendamentos[0];


        if (proximo) {

          const dataFormatada =
            proximo.dataConvertida.toLocaleDateString(
              'pt-BR'
            );


          const tituloAgendamento =
            'Você tem um agendamento próximo!';


          const mensagemAgendamento =
            `${proximo.servico || 'Serviço'} ` +
            `para ${proximo.nomePet || 'seu pet'} ` +
            `em ${dataFormatada} às ` +
            `${proximo.horario}.`;


          await salvarNotificacao({

            usuarioId:
              usuario.uid,

            tipo:
              'agendamento_proximo',

            titulo:
              tituloAgendamento,

            mensagem:
              mensagemAgendamento,

            data:
              new Date(),

            dados: {
              origem:
                'home',

              agendamentoId:
                proximo.id || null,
            },

            chaveUnica:
              `agendamento_proximo_${proximo.id}`,

          });

          listaAvisos.push({

            tipo:
              'agendamento',

            icone:
              '🐾',

            titulo:
              tituloAgendamento,

            mensagem:
              mensagemAgendamento,

          });

        }

      }

      listaAvisos.push({

        tipo:
          'oferta',

        icone:
          '🎁',

        titulo:
          'Tem oferta especial para você!',

        mensagem:
          'Confira as ofertas especiais da PetLover.',

      });

      listaAvisos.push({

        tipo:
          'servico',

        icone:
          '✨',

        titulo:
          'Cuide ainda melhor do seu pet!',

        mensagem:
          'Conheça nossos serviços e encontre o cuidado ideal para seu melhor amigo.',

      });

      if (
        listaAvisos.length > 0
      ) {

        setAvisos(
          listaAvisos
        );

        setAvisoAtual(0);

        setMostrarAviso(true);
      }

    } catch (error) {

      console.log(
        'Erro ao carregar avisos:',
        error
      );

    }
  }

  function proximoAviso() {

    if (
      avisoAtual <
      avisos.length - 1
    ) {

      setAvisoAtual(
        avisoAtual + 1
      );

    } else {

      setMostrarAviso(false);
    }
  }


  const aviso =
    avisos[avisoAtual];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },

      onPanResponderMove: (_, gestureState) => {
        posicaoAviso.setValue(
          gestureState.dx
        );
      },

      onPanResponderRelease: (_, gestureState) => {
        const distancia =
          Math.abs(gestureState.dx);

        if (distancia > 100) {
          const direcao =
            gestureState.dx > 0 ? 1 : -1;

          Animated.timing(posicaoAviso, {
            toValue: direcao * 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            posicaoAviso.setValue(0);
            proximoAviso();
          });
        } else {
          Animated.spring(posicaoAviso, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (

    <View style={styles.container}>

      {mostrarAviso && aviso && (

        <Animated.View
          style={[
            styles.avisoContainer,
            {
              transform: [
                {
                  translateX: posicaoAviso,
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >

          <View style={styles.avisoIconeContainer}>

            <Text style={styles.avisoIcone}>
              {aviso.icone}
            </Text>

          </View>


          <View style={styles.avisoConteudo}>

            <Text style={styles.avisoTitulo}>
              {aviso.titulo}
            </Text>


            <Text style={styles.avisoMensagem}>
              {aviso.mensagem}
            </Text>


            <TouchableOpacity
              onPress={() => {

                if (
                  aviso.tipo ===
                  'agendamento'
                ) {

                  navigation.navigate(
                    'Agendamento'
                  );

                } else {

                  proximoAviso();

                }

              }}
            >

              <Text style={styles.avisoAcao}>

                {aviso.tipo ===
                'agendamento'
                  ? 'Ver agendamento'
                  : 'Continuar'}

              </Text>

            </TouchableOpacity>

          </View>


          <TouchableOpacity
            style={styles.avisoFechar}
            onPress={proximoAviso}
          >

            <Text style={styles.avisoFecharTexto}>
              ×
            </Text>

          </TouchableOpacity>

        </Animated.View>

      )}

      {mostrarPermissao && (

        <View style={styles.permissaoOverlay}>

          <View style={styles.permissaoCard}>

            <Text style={styles.permissaoIcone}>
              🔔
            </Text>


            <Text style={styles.permissaoTitulo}>
              Receba avisos da PetLover
            </Text>


            <Text style={styles.permissaoTexto}>
              Quer receber avisos sobre seus
              agendamentos, ofertas especiais e
              novidades da PetLover?
            </Text>


            <TouchableOpacity
              style={styles.botaoPermitir}
              onPress={aceitarNotificacoes}
            >

              <Text style={styles.botaoPermitirTexto}>
                Permitir avisos
              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              style={styles.botaoAgoraNao}
              onPress={recusarNotificacoes}
            >

              <Text style={styles.botaoAgoraNaoTexto}>
                Agora não
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
      >

        <View style={styles.cabecalho}>

          <View>

            <Text style={styles.ola}>
              Olá! 🐾
            </Text>


            <Text style={styles.titulo}>
              Bem-vindo à PetLover
            </Text>

          </View>


          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Notificacoes'
              )
            }
          >

            <Text style={styles.sino}>
              🔔
            </Text>

          </TouchableOpacity>

        </View>

        <View style={styles.banner}>

          <Text style={styles.bannerTitulo}>
            Cuide do seu melhor amigo
          </Text>


          <Text style={styles.bannerTexto}>
            Encontre serviços, produtos e muito mais.
          </Text>

        </View>

        <Text style={styles.secaoTitulo}>
          Serviços
        </Text>


        <View style={styles.servicos}>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                'Agendamento'
              )
            }
          >

            <Text style={styles.icone}>
              🛁
            </Text>


            <Text style={styles.cardTitulo}>
              Banho
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                'Agendamento'
              )
            }
          >

            <Text style={styles.icone}>
              ✂️
            </Text>


            <Text style={styles.cardTitulo}>
              Tosa
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                'Agendamento'
              )
            }
          >

            <Text style={styles.icone}>
              🐶
            </Text>


            <Text style={styles.cardTitulo}>
              Veterinário
            </Text>

          </TouchableOpacity>

        </View>

        <Text style={styles.secaoTitulo}>
          Encontre tudo para seu pet
        </Text>


        <TouchableOpacity
          style={styles.loja}
          onPress={() =>
            navigation
              .getParent()
              ?.navigate('Loja')
          }
        >

          <Text style={styles.lojaIcone}>
            🛍️
          </Text>


          <View>

            <Text style={styles.lojaTitulo}>
              Loja PetLover
            </Text>


            <Text style={styles.lojaTexto}>
              Produtos para deixar seu pet feliz.
            </Text>

          </View>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },


  scroll: {
    flex: 1,
  },


  conteudo: {
    padding: 20,
  },

  avisoContainer: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',

    elevation: 5,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.15,

    shadowRadius: 5,
  },


  avisoIconeContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },


  avisoIcone: {
    fontSize: 22,
  },


  avisoConteudo: {
    flex: 1,
  },


  avisoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },


  avisoMensagem: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 18,
  },


  avisoAcao: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },


  avisoFechar: {
    paddingLeft: 8,
    paddingTop: 0,
  },


  avisoFecharTexto: {
    fontSize: 24,
    color: colors.gray,
    lineHeight: 24,
  },

  permissaoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor:
      'rgba(0,0,0,0.45)',

    justifyContent: 'center',
    alignItems: 'center',

    padding: 25,

    zIndex: 100,
  },


  permissaoCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
  },


  permissaoIcone: {
    fontSize: 45,
    marginBottom: 12,
  },


  permissaoTitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },


  permissaoTexto: {
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },


  botaoPermitir: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },


  botaoPermitirTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },


  botaoAgoraNao: {
    marginTop: 12,
    paddingVertical: 10,
  },


  botaoAgoraNaoTexto: {
    color: colors.gray,
    fontSize: 14,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },


  ola: {
    fontSize: 16,
    color: colors.gray,
  },


  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 4,
  },


  sino: {
    fontSize: 27,
  },

  banner: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
  },


  bannerTitulo: {
    color: colors.white,
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },


  bannerTexto: {
    color: colors.white,
    fontSize: 14,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.black,
  },


  servicos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },


  card: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },


  icone: {
    fontSize: 32,
    marginBottom: 8,
  },


  cardTitulo: {
    fontWeight: '600',
    color: colors.black,
  },

  loja: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },


  lojaIcone: {
    fontSize: 38,
    marginRight: 15,
  },


  lojaTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
  },


  lojaTexto: {
    color: colors.gray,
    marginTop: 4,
  },

});
