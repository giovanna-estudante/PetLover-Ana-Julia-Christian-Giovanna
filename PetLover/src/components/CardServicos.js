import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
export default function CardServico({
  icone = '🐾',
  nome,
  descricao,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>{icone}</Text>
      </View>
 
      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>
 
        {descricao ? (
          <Text style={styles.descricao}>
            {descricao}
          </Text>
        ) : null}
      </View>
 
      <Text style={styles.seta}>›</Text>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
 
  iconeContainer: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  icone: {
    fontSize: 30,
  },
 
  info: {
    flex: 1,
    marginLeft: 14,
  },
 
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.black,
  },
 
  descricao: {
    color: colors.gray,
    marginTop: 4,
    fontSize: 13,
  },
 
  seta: {
    fontSize: 28,
    color: colors.primary,
    marginLeft: 8,
  },
});