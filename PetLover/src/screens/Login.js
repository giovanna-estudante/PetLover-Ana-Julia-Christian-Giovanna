import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
 
import { fazerLogin } from '../services/auth';
import { colors } from '../styles/theme';
 
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
 
  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
 
    setCarregando(true);
 
    const resultado = await fazerLogin(email, senha);
 
    setCarregando(false);
 
    if (!resultado.sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível realizar o login.'
      );
      return;
    }
 
    navigation.replace('App');
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐾</Text>
 
      <Text style={styles.titulo}>PetLover</Text>
 
      <Text style={styles.subtitulo}>
        Cuide de quem você ama
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
 
      <TouchableOpacity
        style={styles.botao}
        onPress={entrar}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.cadastro}>
          Ainda não possui uma conta? Cadastre-se
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 10,
  },
 
  subtitulo: {
    textAlign: 'center',
    color: colors.gray,
    marginBottom: 35,
    marginTop: 5,
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
 
  textoBotao: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
 
  cadastro: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 22,
  },
});