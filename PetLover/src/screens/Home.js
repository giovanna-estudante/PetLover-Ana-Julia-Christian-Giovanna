import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
export default function Home({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.ola}>Olá! 🐾</Text>
 
          <Text style={styles.titulo}>
            Bem-vindo à PetLover
          </Text>
        </View>
 
        <TouchableOpacity
          onPress={() => navigation.navigate('Notificacoes')}
        >
          <Text style={styles.sino}>🔔</Text>
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
          onPress={() => navigation.navigate('Agendamento')}
        >
          <Text style={styles.icone}>🛁</Text>
 
          <Text style={styles.cardTitulo}>
            Banho
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Agendamento')}
        >
          <Text style={styles.icone}>✂️</Text>
 
          <Text style={styles.cardTitulo}>
            Tosa
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Agendamento')}
        >
          <Text style={styles.icone}>🐶</Text>
 
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
        onPress={() => navigation.getParent()?.navigate('Loja')}
      >
        <Text style={styles.lojaIcone}>🛍️</Text>
 
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
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
 
  conteudo: {
    padding: 20,
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