import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import { auth } from '../config/firebase';

import { buscarPets } from '../services/pets';

import {
  criarAgendamentoComNotificacao,
} from '../services/notificacaoService';

import {
  buscarHorariosOcupados,
} from '../services/agendamento';

import { colors } from '../styles/theme';

const SERVICOS = [
  'Banho',
  'Tosa',
  'Banho e tosa',
  'Higienização',
];

const HORARIOS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

export default function Agendamento({ navigation }) {
  const [pets, setPets] = useState([]);
  const [petSelecionado, setPetSelecionado] =
    useState(null);

  const [servico, setServico] = useState('');

  const [data, setData] = useState('');

  const [horario, setHorario] = useState('');

  const [horariosOcupados, setHorariosOcupados] =
    useState([]);

  const [carregandoPets, setCarregandoPets] =
    useState(true);

  const [carregandoHorarios, setCarregandoHorarios] =
    useState(false);

  const [carregando, setCarregando] =
    useState(false);

  useEffect(() => {
    carregarPets();
  }, []);

  async function carregarPets() {
    if (!auth.currentUser) {
      setCarregandoPets(false);
      return;
    }

    try {
      setCarregandoPets(true);

      const resultado = await buscarPets(
        auth.currentUser.uid
      );

      if (resultado.sucesso) {
        setPets(resultado.pets || []);
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível carregar seus pets.'
        );
      }
    } catch (error) {
      console.log(
        'Erro ao carregar pets no agendamento:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar seus pets.'
      );
    } finally {
      setCarregandoPets(false);
    }
  }

  async function carregarHorariosOcupados(
    dataSelecionada
  ) {
    try {
      setCarregandoHorarios(true);

      // Quando uma nova data é escolhida,
      // o horário anterior deixa de ser válido.
      setHorario('');

      const resultado =
        await buscarHorariosOcupados(
          dataSelecionada
        );

      if (resultado.sucesso) {
        setHorariosOcupados(
          resultado.horarios || []
        );
      } else {
        setHorariosOcupados([]);

        Alert.alert(
          'Erro',
          'Não foi possível verificar os horários disponíveis.'
        );
      }
    } catch (error) {
      console.log(
        'Erro ao carregar horários:',
        error
      );

      setHorariosOcupados([]);

      Alert.alert(
        'Erro',
        'Não foi possível verificar os horários.'
      );
    } finally {
      setCarregandoHorarios(false);
    }
  }

  function selecionarPet(pet) {
    setPetSelecionado(pet);
  }

  function selecionarServico(nomeServico) {
    setServico(nomeServico);
  }

  function selecionarHorario(hora) {
    if (horariosOcupados.includes(hora)) {
      return;
    }

    setHorario(hora);
  }

  async function realizarAgendamento() {
    /*
     * ----------------------------------------
     * VALIDAÇÕES
     * ----------------------------------------
     */

    if (!petSelecionado) {
      Alert.alert(
        'Atenção',
        'Selecione um pet para continuar.'
      );
      return;
    }

    if (!servico) {
      Alert.alert(
        'Atenção',
        'Selecione um serviço.'
      );
      return;
    }

    if (!data) {
      Alert.alert(
        'Atenção',
        'Selecione uma data.'
      );
      return;
    }

    if (!horario) {
      Alert.alert(
        'Atenção',
        'Selecione um horário.'
      );
      return;
    }

    /*
     * Verifica novamente se o horário continua
     * disponível antes de salvar.
     */
    if (horariosOcupados.includes(horario)) {
      Alert.alert(
        'Horário indisponível',
        'Esse horário acabou de ser ocupado. Escolha outro horário.'
      );

      setHorario('');

      await carregarHorariosOcupados(data);

      return;
    }

    /*
     * Verifica se existe usuário logado.
     */
    if (!auth.currentUser) {
      Alert.alert(
        'Erro',
        'Você precisa estar logado.'
      );

      return;
    }

    try {
      setCarregando(true);

      /*
       * ----------------------------------------
       * CRIA AGENDAMENTO
       * ----------------------------------------
       *
       * O notificacaoService agora:
       *
       * 1. Salva o agendamento no Firebase.
       * 2. Cria imediatamente um aviso no
       *    histórico de notificações.
       *
       * NÃO existe mais notificação agendada
       * para 24 horas antes.
       *
       * Também não existe mais dependência de
       * expo-notifications neste fluxo.
       */

      const resultado =
        await criarAgendamentoComNotificacao({
          usuarioId:
            auth.currentUser.uid,

          petId:
            petSelecionado.id,

          nomePet:
            petSelecionado.nome,

          servico,

          data,

          horario,
        });

      /*
       * Se o agendamento falhou, mantém
       * os dados preenchidos na tela.
       */
      if (!resultado.sucesso) {
        Alert.alert(
          'Erro',
          resultado.erro ||
            'Não foi possível realizar o agendamento.'
        );

        return;
      }

      /*
       * ----------------------------------------
       * SUCESSO
       * ----------------------------------------
       */

      Alert.alert(
        'Agendamento realizado! 🐾',
        `O serviço de ${servico} foi agendado para ${petSelecionado.nome} no dia ${data} às ${horario}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setPetSelecionado(null);
              setServico('');
              setData('');
              setHorario('');
              setHorariosOcupados([]);
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        'Erro ao realizar agendamento:',
        error
      );

      Alert.alert(
        'Erro',
        error.message ||
          'Não foi possível realizar o agendamento.'
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
   * ----------------------------------------
   * CARREGANDO PETS
   * ----------------------------------------
   */

  if (carregandoPets) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingTexto}>
          Carregando seus pets...
        </Text>
      </View>
    );
  }

  /*
   * ----------------------------------------
   * NENHUM PET
   * ----------------------------------------
   */

  if (pets.length === 0) {
    return (
      <View style={styles.vazioContainer}>
        <Text style={styles.emojiVazio}>
          🐶
        </Text>

        <Text style={styles.tituloVazio}>
          Você ainda não possui pets
        </Text>

        <Text style={styles.textoVazio}>
          Para realizar um agendamento, primeiro
          cadastre pelo menos um pet no seu perfil.
        </Text>

        <TouchableOpacity
          style={styles.botaoPerfil}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'Perfil',
            })
          }
        >
          <Text style={styles.textoBotao}>
            Ir para Meu Perfil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * ----------------------------------------
   * TELA PRINCIPAL
   * ----------------------------------------
   */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>
        Agendar serviço
      </Text>

      <Text style={styles.subtitulo}>
        Escolha seu pet, serviço, data e horário.
      </Text>

      {/* PET */}

      <Text style={styles.tituloSecao}>
        1. Escolha seu pet
      </Text>

      <View style={styles.lista}>
        {pets.map((pet) => {
          const selecionado =
            petSelecionado?.id === pet.id;

          return (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.cardPet,
                selecionado &&
                  styles.cardPetSelecionado,
              ]}
              onPress={() =>
                selecionarPet(pet)
              }
            >
              <Text style={styles.petEmoji}>
                {pet.especie
                  ?.toLowerCase() === 'gato'
                  ? '🐱'
                  : '🐶'}
              </Text>

              <View style={styles.petInfo}>
                <Text style={styles.petNome}>
                  {pet.nome}
                </Text>

                <Text style={styles.petDetalhes}>
                  {pet.especie}

                  {pet.raca
                    ? ` • ${pet.raca}`
                    : ''}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selecionado &&
                    styles.radioSelecionado,
                ]}
              >
                {selecionado && (
                  <View
                    style={styles.radioInterno}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SERVIÇO */}

      <Text style={styles.tituloSecao}>
        2. Escolha o serviço
      </Text>

      <View style={styles.servicos}>
        {SERVICOS.map((item) => {
          const selecionado =
            servico === item;

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.botaoServico,
                selecionado &&
                  styles.botaoServicoSelecionado,
              ]}
              onPress={() =>
                selecionarServico(item)
              }
            >
              <Text
                style={[
                  styles.textoServico,
                  selecionado &&
                    styles.textoServicoSelecionado,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DATA */}

      <Text style={styles.tituloSecao}>
        3. Escolha a data
      </Text>

      <Calendar
        minDate={
          new Date()
            .toISOString()
            .split('T')[0]
        }
        onDayPress={(day) => {
          setData(day.dateString);

          carregarHorariosOcupados(
            day.dateString
          );
        }}
        markedDates={
          data
            ? {
                [data]: {
                  selected: true,
                  selectedColor:
                    colors.primary,
                },
              }
            : {}
        }
        theme={{
          selectedDayBackgroundColor:
            colors.primary,

          todayTextColor:
            colors.primary,

          arrowColor:
            colors.primary,
        }}
      />

      {/* HORÁRIOS */}

      <Text style={styles.tituloSecao}>
        4. Escolha o horário
      </Text>

      {!data ? (
        <Text style={styles.aviso}>
          Primeiro selecione uma data.
        </Text>
      ) : carregandoHorarios ? (
        <View style={styles.carregandoHorarios}>
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />

          <Text style={styles.aviso}>
            Verificando horários...
          </Text>
        </View>
      ) : (
        <View style={styles.horarios}>
          {HORARIOS.map((hora) => {
            const ocupado =
              horariosOcupados.includes(hora);

            const selecionado =
              horario === hora;

            return (
              <TouchableOpacity
                key={hora}
                disabled={ocupado}
                style={[
                  styles.botaoHorario,

                  selecionado &&
                    styles.botaoHorarioSelecionado,

                  ocupado &&
                    styles.botaoHorarioOcupado,
                ]}
                onPress={() =>
                  selecionarHorario(hora)
                }
              >
                <Text
                  style={[
                    styles.textoHorario,

                    selecionado &&
                      styles.textoHorarioSelecionado,

                    ocupado &&
                      styles.textoHorarioOcupado,
                  ]}
                >
                  {hora}
                </Text>

                {ocupado && (
                  <Text style={styles.textoOcupado}>
                    Ocupado
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* RESUMO */}

      {petSelecionado &&
        servico &&
        data &&
        horario && (
          <View style={styles.resumo}>
            <Text style={styles.resumoTitulo}>
              Resumo do agendamento
            </Text>

            <Text style={styles.resumoTexto}>
              🐾 Pet: {petSelecionado.nome}
            </Text>

            <Text style={styles.resumoTexto}>
              ✂️ Serviço: {servico}
            </Text>

            <Text style={styles.resumoTexto}>
              📅 Data: {data}
            </Text>

            <Text style={styles.resumoTexto}>
              🕐 Horário: {horario}
            </Text>
          </View>
        )}

      {/* CONFIRMAR */}

      <TouchableOpacity
        style={[
          styles.botaoConfirmar,
          carregando &&
            styles.botaoDesativado,
        ]}
        onPress={realizarAgendamento}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoConfirmar}>
            Confirmar agendamento
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },

  subtitulo: {
    color: colors.gray,
    marginTop: 5,
    marginBottom: 25,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 22,
    marginBottom: 12,
  },

  lista: {
    gap: 10,
  },

  cardPet: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardPetSelecionado: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  petEmoji: {
    fontSize: 32,
  },

  petInfo: {
    flex: 1,
    marginLeft: 12,
  },

  petNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.black,
  },

  petDetalhes: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 3,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelecionado: {
    borderColor: colors.primary,
  },

  radioInterno: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  servicos: {
    gap: 10,
  },

  botaoServico: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
  },

  botaoServicoSelecionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  textoServico: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 15,
    fontWeight: '600',
  },

  textoServicoSelecionado: {
    color: colors.white,
  },

  horarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  botaoHorario: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },

  botaoHorarioSelecionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  botaoHorarioOcupado: {
    backgroundColor: '#E5E5E5',
    borderColor: '#CCCCCC',
    opacity: 0.6,
  },

  textoHorario: {
    color: colors.black,
    fontWeight: '600',
  },

  textoHorarioSelecionado: {
    color: colors.white,
  },

  textoHorarioOcupado: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },

  textoOcupado: {
    fontSize: 10,
    color: '#888888',
    marginTop: 3,
  },

  aviso: {
    color: colors.gray,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    textAlign: 'center',
  },

  carregandoHorarios: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },

  resumo: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 25,
  },

  resumoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
  },

  resumoTexto: {
    fontSize: 15,
    color: colors.black,
    marginTop: 7,
  },

  botaoConfirmar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    marginTop: 25,
  },

  botaoDesativado: {
    opacity: 0.7,
  },

  textoConfirmar: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingTexto: {
    marginTop: 15,
    color: colors.gray,
    fontSize: 15,
  },

  vazioContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emojiVazio: {
    fontSize: 60,
    marginBottom: 15,
  },

  tituloVazio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },

  textoVazio: {
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },

  botaoPerfil: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginTop: 25,
  },

  textoBotao: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});