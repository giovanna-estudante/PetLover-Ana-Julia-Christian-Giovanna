import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
 
import { entrar as entrarNaConta } from '../services/auth';
import { colors } from '../styles/theme';
 
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
 
  async function executarLogin() {
    if (!email || !senha) {
      Alert.alert(
        'Atenção',
        'Preencha e-mail e senha.'
      );
      return;
    }

    try {
      setCarregando(true);

      console.log('TENTANDO FAZER LOGIN...');
      console.log('E-mail:', email.trim());

      const resultado = await entrarNaConta(
        email.trim(),
        senha
      );

      console.log('RESULTADO DO LOGIN:', resultado);

      if (!resultado.sucesso) {
        console.log('CÓDIGO:', resultado.codigo);
        console.log('ERRO:', resultado.erro);

        Alert.alert(
          'Erro no login',
          `${resultado.codigo || 'Erro'}\n\n${
            resultado.erro || 'Não foi possível realizar o login.'
          }`
        );

        return;
      }

      console.log('LOGIN REALIZADO COM SUCESSO!');

      navigation.replace('App');

    } catch (error) {
      console.log('ERRO COMPLETO NO LOGIN:', error);
      console.log('CÓDIGO:', error?.code);
      console.log('MENSAGEM:', error?.message);

      Alert.alert(
        'Erro no login',
        `${error?.code || 'Erro'}\n\n${
          error?.message || 'Não foi possível realizar o login.'
        }`
      );
    } finally {
      setCarregando(false);
    }
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
        onPress={executarLogin}
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