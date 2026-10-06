import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
 
import { colors } from '../styles/theme';
 
const servicos = [
  {
    id: '1',
    nome: 'Banho',
    descricao: 'Banho completo para seu pet.',
    icone: '🛁',
  },
  {
    id: '2',
    nome: 'Tosa',
    descricao: 'Cuidados com pelos e higiene.',
    icone: '✂️',
  },
  {
    id: '3',
    nome: 'Veterinário',
    descricao: 'Atendimento para seu melhor amigo.',
    icone: '🩺',
  },
  {
    id: '4',
    nome: 'Higiene',
    descricao: 'Cuidados especiais e limpeza.',
    icone: '🐾',
  },
];
 
export default function Servicos({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Nossos serviços
      </Text>
 
      {servicos.map((servico) => (
        <TouchableOpacity
          key={servico.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate('Agendamento')
          }
        >
          <Text style={styles.icone}>
            {servico.icone}
          </Text>
 
          <View style={styles.info}>
            <Text style={styles.nome}>
              {servico.nome}
            </Text>
 
            <Text style={styles.descricao}>
              {servico.descricao}
            </Text>
          </View>
 
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
      ))}
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
    marginBottom: 20,
  },
 
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  icone: {
    fontSize: 35,
    marginRight: 15,
  },
 
  info: {
    flex: 1,
  },
 
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
  descricao: {
    color: colors.gray,
    marginTop: 5,
  },
 
  seta: {
    fontSize: 30,
    color: colors.primary,
  },
});