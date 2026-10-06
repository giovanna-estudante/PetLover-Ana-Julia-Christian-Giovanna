import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
 
import { cadastrarUsuario } from '../services/auth';
import { colors } from '../styles/theme';
 
export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
 
  async function cadastrar() {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
 
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não são iguais.');
      return;
    }
 
    setCarregando(true);
 
    const resultado = await cadastrarUsuario(
      email,
      senha
    );
 
    setCarregando(false);
 
    if (!resultado.sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível criar a conta.'
      );
      return;
    }
 
    Alert.alert(
      'Cadastro realizado!',
      'Sua conta foi criada com sucesso.',
      [
        {
          text: 'Continuar',
          onPress: () => navigation.replace('App'),
        },
      ]
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐾</Text>
 
      <Text style={styles.titulo}>Criar conta</Text>
 
      <Text style={styles.subtitulo}>
        Faça parte da PetLover
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
 
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
 
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
 
      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Criando...' : 'Criar conta'}
        </Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.login}>
          Já possui uma conta? Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
 
  logo: {
    fontSize: 55,
    textAlign: 'center',
  },
 
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 10,
  },
 
  subtitulo: {
    textAlign: 'center',
    color: colors.gray,
    marginBottom: 30,
  },
 
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
 
  botao: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
 
  textoBotao: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
 
  login: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 22,
  },
});