import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import Input from '../components/Input';
import Botao from '../components/Botao';

import { cadastrar } from '../services/auth';
import { colors } from '../styles/theme';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function realizarCadastro() {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'As senhas não são iguais.'
      );
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Atenção',
        'A senha deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    try {
      setCarregando(true);

      const resultado = await cadastrar(
        email.trim(),
        senha
      );

      console.log(
        'Usuário cadastrado:',
        resultado.user.email
      );

      Alert.alert(
        'Cadastro realizado! 🐾',
        'Sua conta foi criada com sucesso.',
        [
          {
            text: 'Continuar',
            onPress: () => navigation.replace('App'),
          },
        ]
      );
    } catch (error) {
      console.log('ERRO COMPLETO DO FIREBASE:', error);
      console.log('CÓDIGO DO ERRO:', error?.code);
      console.log('MENSAGEM DO ERRO:', error?.message);

      Alert.alert(
        'Erro no cadastro',
        `${error?.code || 'Erro'}\n\n${error?.message || 'Não foi possível criar a conta.'}`
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐾</Text>

      <Text style={styles.titulo}>
        Criar conta
      </Text>

      <Text style={styles.subtitulo}>
        Cadastre-se para cuidar ainda melhor do seu pet.
      </Text>

      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Input
        label="Confirmar senha"
        placeholder="Digite a senha novamente"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Botao
        titulo="Criar conta"
        onPress={realizarCadastro}
        carregando={carregando}
      />

      <TouchableOpacity
        style={styles.login}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginTexto}>
          Já tenho uma conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 10,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },

  login: {
    alignItems: 'center',
    marginTop: 20,
  },

  loginTexto: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});