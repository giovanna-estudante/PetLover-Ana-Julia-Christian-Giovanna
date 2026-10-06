import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
export default function CardOferta({
  titulo,
  descricao,
  preco,
  precoAnterior,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.tag}>
        <Text style={styles.tagTexto}>
          OFERTA
        </Text>
      </View>
 
      <Text style={styles.titulo}>
        {titulo}
      </Text>
 
      {descricao ? (
        <Text style={styles.descricao}>
          {descricao}
        </Text>
      ) : null}
 
      <View style={styles.precos}>
        {precoAnterior ? (
          <Text style={styles.precoAnterior}>
            {precoAnterior}
          </Text>
        ) : null}
 
        <Text style={styles.preco}>
          {preco}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
  },
 
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },
 
  tagTexto: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
 
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
 
  descricao: {
    color: colors.gray,
    marginTop: 5,
  },
 
  precos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
 
  precoAnterior: {
    color: colors.gray,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
 
  preco: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: 'bold',
  },
});