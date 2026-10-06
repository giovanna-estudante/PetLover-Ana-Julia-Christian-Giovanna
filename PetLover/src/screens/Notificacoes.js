import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
 
import { buscarAgendamentos } from '../services/agendamento';
import { auth } from '../config/firebase';
import { colors } from '../styles/theme';
 
export default function Notificacoes() {
  const [agendamentos, setAgendamentos] = useState([]);
 
  useEffect(() => {
    carregarNotificacoes();
  }, []);
 
  async function carregarNotificacoes() {
    if (!auth.currentUser) {
      return;
    }
 
    const resultado = await buscarAgendamentos(
      auth.currentUser.uid
    );
 
    if (resultado.sucesso) {
      setAgendamentos(resultado.agendamentos);
    }
  }
 
  function renderItem({ item }) {
    let dataFormatada = '';
 
    if (item.data?.toDate) {
      dataFormatada = item.data
        .toDate()
        .toLocaleDateString('pt-BR');
    }
 
    return (
      <View style={styles.card}>
        <Text style={styles.icone}>🔔</Text>
 
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>
            Agendamento realizado
          </Text>
 
          <Text style={styles.texto}>
            {item.nomePet} possui um agendamento de{' '}
            {item.servico}.
          </Text>
 
          <Text style={styles.data}>
            {dataFormatada} às {item.horario}
          </Text>
        </View>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Notificações
      </Text>
 
      {agendamentos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>🔔</Text>
 
          <Text style={styles.vazioTitulo}>
            Nenhuma notificação
          </Text>
 
          <Text style={styles.vazioTexto}>
            Seus lembretes de agendamento aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
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
    marginBottom: 20,
  },
 
  lista: {
    paddingBottom: 20,
  },
 
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
 
  icone: {
    fontSize: 27,
    marginRight: 14,
  },
 
  conteudo: {
    flex: 1,
  },
 
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
 
  texto: {
    color: colors.gray,
    marginTop: 5,
  },
 
  data: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 7,
  },
 
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
 
  vazioIcone: {
    fontSize: 50,
    marginBottom: 15,
  },
 
  vazioTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
 
  vazioTexto: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 8,
  },
});