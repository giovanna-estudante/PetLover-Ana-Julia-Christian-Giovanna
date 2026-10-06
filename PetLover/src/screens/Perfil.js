import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
 
import { auth } from '../config/firebase';
import { fazerLogout } from '../services/auth';
import { colors } from '../styles/theme';
 
export default function Perfil({ navigation }) {
  const usuario = auth.currentUser;
 
  async function sair() {
    const resultado = await fazerLogout();
 
    if (resultado.sucesso) {
      navigation.getParent()?.replace('Auth');
    } else {
      Alert.alert(
        'Erro',
        'Não foi possível sair da conta.'
      );
    }
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meu perfil</Text>
 
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>🐾</Text>
      </View>
 
      <Text style={styles.email}>
        {usuario?.email || 'Usuário'}
      </Text>
 
      <View style={styles.card}>
        <Text style={styles.label}>
          Conta
        </Text>
 
        <Text style={styles.valor}>
          {usuario?.email || 'Não informado'}
        </Text>
      </View>
 
      <TouchableOpacity
        style={styles.botaoSair}
        onPress={sair}
      >
        <Text style={styles.textoSair}>
          Sair da conta
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
  },
 
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 35,
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
 
  email: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 30,
  },
 
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 15,
  },
 
  label: {
    color: colors.gray,
    fontSize: 13,
  },
 
  valor: {
    fontSize: 16,
    marginTop: 5,
  },
 
  botaoSair: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
 
  textoSair: {
    color: colors.danger,
    fontWeight: 'bold',
  },
});