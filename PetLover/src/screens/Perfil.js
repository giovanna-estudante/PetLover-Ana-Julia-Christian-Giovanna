import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import { auth } from '../config/firebase';

import {
  sair as sairDaConta,
  alterarEmail,
  alterarSenha,
  reautenticar,
  excluirConta,
} from '../services/auth';

import {
  buscarPets,
  criarPet,
  editarPet,
  excluirPet,
} from '../services/pets';

import { colors } from '../styles/theme';

export default function Perfil({ navigation }) {
  const usuario = auth.currentUser;

  const [pets, setPets] = useState([]);
  const [carregandoPets, setCarregandoPets] = useState(true);

  const [modalPet, setModalPet] = useState(false);
  const [petEditando, setPetEditando] = useState(null);

  const [nomePet, setNomePet] = useState('');
  const [especiePet, setEspeciePet] = useState('');
  const [racaPet, setRacaPet] = useState('');
  const [idadePet, setIdadePet] = useState('');

  const [salvandoPet, setSalvandoPet] = useState(false);

  useEffect(() => {
    console.log('PERFIL ABRIU');
    carregarPets();
  }, []);

  async function carregarPets() {
    if (!auth.currentUser) {
      return;
    }

    setCarregandoPets(true);

    const resultado = await buscarPets(
      auth.currentUser.uid
    );

    if (resultado.sucesso) {
      setPets(resultado.pets);
    } else {
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus pets.'
      );
    }

    setCarregandoPets(false);
  }

  function abrirAdicionarPet() {
    setPetEditando(null);

    setNomePet('');
    setEspeciePet('');
    setRacaPet('');
    setIdadePet('');

    setModalPet(true);
  }

  function abrirEditarPet(pet) {
    setPetEditando(pet);

    setNomePet(pet.nome || '');
    setEspeciePet(pet.especie || '');
    setRacaPet(pet.raca || '');
    setIdadePet(
      pet.idade !== undefined
        ? String(pet.idade)
        : ''
    );

    setModalPet(true);
  }

  function fecharModalPet() {
    if (salvandoPet) {
      return;
    }

    setModalPet(false);
  }

  async function salvarPet() {
    if (!nomePet.trim()) {
      Alert.alert(
        'Atenção',
        'Digite o nome do pet.'
      );
      return;
    }

    if (!especiePet.trim()) {
      Alert.alert(
        'Atenção',
        'Informe a espécie do pet.'
      );
      return;
    }

    setSalvandoPet(true);

    let resultado;

    if (petEditando) {
      resultado = await editarPet(
        petEditando.id,
        {
          nome: nomePet.trim(),
          especie: especiePet.trim(),
          raca: racaPet.trim(),
          idade: idadePet.trim(),
        }
      );
    } else {
      resultado = await criarPet({
        usuarioId: auth.currentUser.uid,
        nome: nomePet.trim(),
        especie: especiePet.trim(),
        raca: racaPet.trim(),
        idade: idadePet.trim(),
      });
    }

    setSalvandoPet(false);

    if (!resultado.sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar o pet.'
      );
      return;
    }

    setModalPet(false);

    await carregarPets();

    Alert.alert(
      'Sucesso',
      petEditando
        ? 'Pet atualizado com sucesso!'
        : 'Pet cadastrado com sucesso!'
    );
  }

  function confirmarExclusaoPet(pet) {
    Alert.alert(
      'Excluir pet',
      `Tem certeza que deseja excluir ${pet.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => executarExclusaoPet(pet.id),
        },
      ]
    );
  }

  async function executarExclusaoPet(petId) {
    const resultado = await excluirPet(petId);

    if (!resultado.sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível excluir o pet.'
      );
      return;
    }

    await carregarPets();
  }

  async function executarSaida() {
    const resultado = await sairDaConta();

    if (resultado.sucesso) {
      navigation.getParent()?.replace('Auth');
    } else {
      Alert.alert(
        'Erro',
        'Não foi possível sair da conta.'
      );
    }
  }

  function alterarEmailUsuario() {
    Alert.prompt(
      'Alterar e-mail',
      'Digite o novo endereço de e-mail:',
      async (novoEmail) => {
        if (!novoEmail || !novoEmail.trim()) {
          return;
        }

        const resultado =
          await alterarEmail(novoEmail.trim());

        if (resultado.sucesso) {
          Alert.alert(
            'Sucesso',
            'Seu e-mail foi alterado.'
          );
        } else if (
          resultado.codigo ===
          'auth/requires-recent-login'
        ) {
          pedirReautenticacao('email', novoEmail.trim());
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível alterar o e-mail.'
          );
        }
      }
    );
  }

  function alterarSenhaUsuario() {
    Alert.prompt(
      'Alterar senha',
      'Digite sua nova senha:',
      async (novaSenha) => {
        if (!novaSenha || novaSenha.length < 6) {
          Alert.alert(
            'Atenção',
            'A senha deve ter pelo menos 6 caracteres.'
          );
          return;
        }

        const resultado =
          await alterarSenha(novaSenha);

        if (resultado.sucesso) {
          Alert.alert(
            'Sucesso',
            'Sua senha foi alterada.'
          );
        } else if (
          resultado.codigo ===
          'auth/requires-recent-login'
        ) {
          pedirReautenticacao('senha', novaSenha);
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível alterar a senha.'
          );
        }
      }
    );
  }

  function pedirReautenticacao(tipo, valor) {
    Alert.prompt(
      'Confirme sua senha',
      'Por segurança, digite sua senha atual:',
      async (senhaAtual) => {
        if (!senhaAtual) {
          return;
        }

        const resultado =
          await reautenticar(senhaAtual);

        if (!resultado.sucesso) {
          Alert.alert(
            'Erro',
            'A senha atual está incorreta.'
          );
          return;
        }

        if (tipo === 'email') {
          const alteracao =
            await alterarEmail(valor);

          if (alteracao.sucesso) {
            Alert.alert(
              'Sucesso',
              'Seu e-mail foi alterado.'
            );
          } else {
            Alert.alert(
              'Erro',
              'Não foi possível alterar o e-mail.'
            );
          }
        }

        if (tipo === 'senha') {
          const alteracao =
            await alterarSenha(valor);

          if (alteracao.sucesso) {
            Alert.alert(
              'Sucesso',
              'Sua senha foi alterada.'
            );
          } else {
            Alert.alert(
              'Erro',
              'Não foi possível alterar a senha.'
            );
          }
        }
      },
      'secure-text'
    );
  }

  function confirmarExclusaoConta() {
    Alert.alert(
      'Excluir conta',
      'Essa ação excluirá sua conta do PetLover. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir conta',
          style: 'destructive',
          onPress: pedirSenhaParaExcluirConta,
        },
      ]
    );
  }

  function pedirSenhaParaExcluirConta() {
    Alert.prompt(
      'Confirme sua senha',
      'Digite sua senha atual para excluir sua conta:',
      async (senhaAtual) => {
        if (!senhaAtual) {
          return;
        }

        const reautenticacao =
          await reautenticar(senhaAtual);

        if (!reautenticacao.sucesso) {
          Alert.alert(
            'Erro',
            'A senha atual está incorreta.'
          );
          return;
        }

        const resultado =
          await excluirConta();

        if (!resultado.sucesso) {
          Alert.alert(
            'Erro',
            'Não foi possível excluir sua conta.'
          );
          return;
        }

        Alert.alert(
          'Conta excluída',
          'Sua conta foi excluída com sucesso.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.getParent()?.replace('Auth');
              },
            },
          ]
        );
      },
      'secure-text'
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>
          Meu perfil
        </Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            🐾
          </Text>
        </View>

        <Text style={styles.emailPrincipal}>
          {usuario?.email || 'Usuário'}
        </Text>

        {/* ========================= */}
        {/* MINHA CONTA */}
        {/* ========================= */}

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            Minha conta
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              E-mail
            </Text>

            <Text style={styles.valor}>
              {usuario?.email || 'Não informado'}
            </Text>

            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={alterarEmailUsuario}
            >
              <Text style={styles.textoBotaoSecundario}>
                Alterar e-mail
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={alterarSenhaUsuario}
            >
              <Text style={styles.textoBotaoSecundario}>
                Alterar senha
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={confirmarExclusaoConta}
            >
              <Text style={styles.textoExcluir}>
                Excluir conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================= */}
        {/* MEUS PETS */}
        {/* ========================= */}

        <View style={styles.secao}>
          <View style={styles.tituloLinha}>
            <Text style={styles.tituloSecao}>
              Meus pets
            </Text>

            <TouchableOpacity
              onPress={abrirAdicionarPet}
            >
              <Text style={styles.adicionar}>
                + Adicionar
              </Text>
            </TouchableOpacity>
          </View>

          {carregandoPets ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loading}
            />
          ) : pets.length === 0 ? (
            <View style={styles.cardVazio}>
              <Text style={styles.emojiVazio}>
                🐶
              </Text>

              <Text style={styles.tituloVazio}>
                Você ainda não cadastrou nenhum pet
              </Text>

              <Text style={styles.textoVazio}>
                Cadastre seu pet para poder fazer
                agendamentos pelo aplicativo.
              </Text>

              <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={abrirAdicionarPet}
              >
                <Text style={styles.textoBotaoAdicionar}>
                  Adicionar meu primeiro pet
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            pets.map((pet) => (
              <View
                key={pet.id}
                style={styles.cardPet}
              >
                <View style={styles.petIcone}>
                  <Text style={styles.petEmoji}>
                    {pet.especie?.toLowerCase() ===
                    'gato'
                      ? '🐱'
                      : '🐶'}
                  </Text>
                </View>

                <View style={styles.petInformacoes}>
                  <Text style={styles.petNome}>
                    {pet.nome}
                  </Text>

                  <Text style={styles.petDetalhes}>
                    {pet.especie}
                    {pet.raca
                      ? ` • ${pet.raca}`
                      : ''}
                  </Text>

                  {pet.idade ? (
                    <Text style={styles.petDetalhes}>
                      {pet.idade} anos
                    </Text>
                  ) : null}
                </View>

                <View style={styles.petAcoes}>
                  <TouchableOpacity
                    onPress={() =>
                      abrirEditarPet(pet)
                    }
                  >
                    <Text style={styles.editar}>
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      confirmarExclusaoPet(pet)
                    }
                  >
                    <Text style={styles.excluir}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* SAIR */}

        <TouchableOpacity
          style={styles.botaoSair}
          onPress={executarSaida}
        >
          <Text style={styles.textoSair}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ========================= */}
      {/* MODAL DO PET */}
      {/* ========================= */}

      <Modal
        visible={modalPet}
        animationType="slide"
        transparent
        onRequestClose={fecharModalPet}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              {petEditando
                ? 'Editar pet'
                : 'Adicionar pet'}
            </Text>

            <Text style={styles.modalSubtitulo}>
              Preencha as informações do seu pet.
            </Text>

            <Text style={styles.inputLabel}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Mel"
              value={nomePet}
              onChangeText={setNomePet}
            />

            <Text style={styles.inputLabel}>
              Espécie
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Cachorro"
              value={especiePet}
              onChangeText={setEspeciePet}
            />

            <Text style={styles.inputLabel}>
              Raça
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Golden Retriever"
              value={racaPet}
              onChangeText={setRacaPet}
            />

            <Text style={styles.inputLabel}>
              Idade
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: 3"
              value={idadePet}
              onChangeText={setIdadePet}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarPet}
              disabled={salvandoPet}
            >
              {salvandoPet ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textoBotaoSalvar}>
                  {petEditando
                    ? 'Salvar alterações'
                    : 'Cadastrar pet'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={fecharModalPet}
              disabled={salvandoPet}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 30,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTexto: {
    fontSize: 45,
  },

  emailPrincipal: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 30,
    color: colors.black,
  },

  secao: {
    marginBottom: 28,
  },

  tituloLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  tituloSecao: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.black,
  },

  adicionar: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
  },

  label: {
    color: colors.gray,
    fontSize: 13,
  },

  valor: {
    fontSize: 16,
    marginTop: 5,
    color: colors.black,
    marginBottom: 15,
  },

  botaoSecundario: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBotaoSecundario: {
    color: colors.primary,
    fontWeight: 'bold',
  },

  botaoExcluir: {
    marginTop: 18,
    padding: 12,
    alignItems: 'center',
  },

  textoExcluir: {
    color: colors.danger,
    fontWeight: 'bold',
  },

  loading: {
    marginTop: 25,
  },

  cardVazio: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
  },

  emojiVazio: {
    fontSize: 45,
    marginBottom: 12,
  },

  tituloVazio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },

  textoVazio: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  botaoAdicionar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    marginTop: 18,
  },

  textoBotaoAdicionar: {
    color: colors.white,
    fontWeight: 'bold',
  },

  cardPet: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  petIcone: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petEmoji: {
    fontSize: 30,
  },

  petInformacoes: {
    flex: 1,
    marginLeft: 13,
  },

  petNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },

  petDetalhes: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 3,
  },

  petAcoes: {
    alignItems: 'flex-end',
    gap: 8,
  },

  editar: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },

  excluir: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 13,
  },

  botaoSair: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  textoSair: {
    color: colors.danger,
    fontWeight: 'bold',
  },

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: 35,
  },

  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
  },

  modalSubtitulo: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.background,
  },

  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
  },

  textoBotaoSalvar: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },

  botaoCancelar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },

  textoCancelar: {
    color: colors.gray,
    fontWeight: 'bold',
  },
});