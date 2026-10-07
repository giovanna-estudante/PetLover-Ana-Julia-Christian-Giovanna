
import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db, auth } from '../config/firebase';
import { colors } from '../styles/theme';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] =
    useState([]);

  const [atualizando, setAtualizando] =
    useState(false);

  const carregarNotificacoes = useCallback(
    async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        const consulta = query(
          collection(db, 'notificacoes'),
          where(
            'usuarioId',
            '==',
            auth.currentUser.uid
          )
        );

        const resultado =
          await getDocs(consulta);

        const lista = resultado.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        // Mais recentes primeiro
        lista.sort((a, b) => {
          const dataA =
            a.data?.toDate
              ? a.data.toDate()
              : new Date(a.data);

          const dataB =
            b.data?.toDate
              ? b.data.toDate()
              : new Date(b.data);

          return dataB - dataA;
        });

        setNotificacoes(lista);
      } catch (error) {
        console.log(
          'Erro ao carregar notificações:',
          error
        );
      }
    },
    []
  );

  React.useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  async function atualizar() {
    setAtualizando(true);

    await carregarNotificacoes();

    setAtualizando(false);
  }

  function obterIcone(tipo) {
    switch (tipo) {
      case 'agendamento':
        return '📅';

      case 'banho':
        return '🛁';

      case 'oferta':
        return '🛍️';

      default:
        return '🔔';
    }
  }

  function formatarData(data) {
    if (!data) {
      return '';
    }

    let dataConvertida;

    if (data?.toDate) {
      dataConvertida = data.toDate();
    } else {
      dataConvertida = new Date(data);
    }

    if (
      Number.isNaN(
        dataConvertida.getTime()
      )
    ) {
      return '';
    }

    return dataConvertida.toLocaleDateString(
      'pt-BR'
    );
  }

  function formatarHorario(data) {
    if (!data) {
      return '';
    }

    let dataConvertida;

    if (data?.toDate) {
      dataConvertida = data.toDate();
    } else {
      dataConvertida = new Date(data);
    }

    if (
      Number.isNaN(
        dataConvertida.getTime()
      )
    ) {
      return '';
    }

    return dataConvertida.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.icone}>
          {obterIcone(item.tipo)}
        </Text>

        <View style={styles.conteudo}>
          <Text style={styles.titulo}>
            {item.titulo ||
              'Notificação'}
          </Text>

          <Text style={styles.texto}>
            {item.mensagem}
          </Text>

          <Text style={styles.data}>
            {formatarData(item.data)}

            {item.tipo === 'agendamento' &&
              item.data &&
              ` às ${formatarHorario(
                item.data
              )}`}
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

      {notificacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>
            🔔
          </Text>

          <Text style={styles.vazioTitulo}>
            Nenhuma notificação
          </Text>

          <Text style={styles.vazioTexto}>
            Seus lembretes e novidades
            aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item, index) =>
            item.id ||
            index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={
            styles.lista
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={atualizar}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
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
    lineHeight: 20,
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