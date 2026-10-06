import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
export default function Botao({
  titulo,
  onPress,
  carregando = false,
  desabilitado = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.botao,
        desabilitado && styles.desabilitado,
      ]}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.texto}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  botao: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  desabilitado: {
    opacity: 0.5,
  },
 
  texto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});