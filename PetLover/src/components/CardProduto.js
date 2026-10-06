import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
export default function CardProduto({
  nome,
  preco,
  imagem,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imagemContainer}>
        {imagem ? (
          imagem
        ) : (
          <Text style={styles.placeholder}>
            🐾
          </Text>
        )}
      </View>
 
      <Text style={styles.nome} numberOfLines={2}>
        {nome}
      </Text>
 
      <Text style={styles.preco}>
        {preco}
      </Text>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
 
  imagemContainer: {
    height: 130,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
 
  placeholder: {
    fontSize: 50,
  },
 
  nome: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
 
  preco: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
});