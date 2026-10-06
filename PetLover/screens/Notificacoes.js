import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const NOTIFICATIONS = [
  { id: '1', title: 'Novo pedido', description: 'Seu pedido #123 foi aprovado.', time: '10 min atrás' },
  { id: '2', title: 'Promoção', description: 'Desconto de 20% hoje!', time: '2 horas atrás' },
];

export default function Notificaticoes() {
  return (
    <View style={styles.container}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  desc: { fontSize: 14, color: '#666', marginVertical: 4 },
  time: { fontSize: 12, color: '#999', alignSelf: 'flex-end' },
});
