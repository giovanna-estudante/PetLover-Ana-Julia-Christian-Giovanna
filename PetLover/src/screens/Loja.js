import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
const produtos = [
  {
    id: '1',
    nome: 'Ração Premium',
    preco: 'R$ 89,90',
    icone: '🥣',
  },
  {
    id: '2',
    nome: 'Brinquedo para cães',
    preco: 'R$ 29,90',
    icone: '🧸',
  },
  {
    id: '3',
    nome: 'Cama para pet',
    preco: 'R$ 119,90',
    icone: '🛏️',
  },
  {
    id: '4',
    nome: 'Coleira',
    preco: 'R$ 39,90',
    icone: '🐕',
  },
];
 
export default function Loja() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Loja PetLover
      </Text>
 
      <Text style={styles.subtitulo}>
        Produtos para o seu melhor amigo 🐾
      </Text>
 
      <View style={styles.grid}>
        {produtos.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            style={styles.card}
          >
            <View style={styles.imagem}>
              <Text style={styles.icone}>
                {produto.icone}
              </Text>
            </View>
 
            <Text style={styles.nome}>
              {produto.nome}
            </Text>
 
            <Text style={styles.preco}>
              {produto.preco}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  },
 
  subtitulo: {
    color: colors.gray,
    marginTop: 5,
    marginBottom: 20,
  },
 
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
 
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 12,
    marginBottom: 16,
  },
 
  imagem: {
    height: 130,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
 
  icone: {
    fontSize: 55,
  },
 
  nome: {
    fontWeight: '600',
    fontSize: 15,
  },
 
  preco: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
  },
});