import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
 
import { auth } from '../config/firebase';
import {
  criarAgendamentoComNotificacao,
} from '../services/notificacaoService';
 
import { colors } from '../styles/theme';
 
export default function Agendamento() {
  const [nomePet, setNomePet] = useState('');
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [carregando, setCarregando] = useState(false);
 
  async function realizarAgendamento() {
    if (
      !nomePet ||
      !servico ||
      !data ||
      !horario
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );
      return;
    }
 
    if (!auth.currentUser) {
      Alert.alert(
        'Erro',
        'Você precisa estar logado.'
      );
      return;
    }
 
    setCarregando(true);
 
    const resultado =
      await criarAgendamentoComNotificacao({
        usuarioId: auth.currentUser.uid,
        petId: 'pet-principal',
        nomePet,
        servico,
        data,
        horario,
      });
 
    setCarregando(false);
 
    if (!resultado.sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível realizar o agendamento.'
      );
      return;
    }
 
    Alert.alert(
      'Agendamento realizado! 🐾',
      `O serviço de ${servico} foi agendado para ${nomePet}.`
    );
 
    setNomePet('');
    setServico('');
    setData('');
    setHorario('');
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Agendar serviço
      </Text>
 
      <Text style={styles.subtitulo}>
        Escolha o serviço para seu pet
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Nome do pet"
        value={nomePet}
        onChangeText={setNomePet}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Serviço (ex.: Banho)"
        value={servico}
        onChangeText={setServico}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Data (AAAA-MM-DD)"
        value={data}
        onChangeText={setData}
        keyboardType="numbers-and-punctuation"
      />
 
      <TextInput
        style={styles.input}
        placeholder="Horário (HH:MM)"
        value={horario}
        onChangeText={setHorario}
        keyboardType="numbers-and-punctuation"
      />
 
      <TouchableOpacity
        style={styles.botao}
        onPress={realizarAgendamento}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando
            ? 'Agendando...'
            : 'Confirmar agendamento'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
 
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
 
  subtitulo: {
    color: colors.gray,
    marginTop: 5,
    marginBottom: 30,
  },
 
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
 
  botao: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
 
  textoBotao: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});