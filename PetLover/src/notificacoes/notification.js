import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
 
// Define como a notificação será apresentada quando o app estiver aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
 
// Solicita permissão para enviar notificações
export async function solicitarPermissaoNotificacao() {
  const { status: statusAtual } =
    await Notifications.getPermissionsAsync();
 
  let status = statusAtual;
 
  if (status !== 'granted') {
    const resultado =
      await Notifications.requestPermissionsAsync();
 
    status = resultado.status;
  }
 
  if (status !== 'granted') {
    console.log('Permissão para notificações não concedida.');
    return false;
  }
 
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('petlover', {
      name: 'PetLover',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }
 
  return true;
}
 
// Agenda uma notificação para uma data específica
export async function agendarNotificacao({
  titulo,
  mensagem,
  data,
  dados = {},
}) {
  const permitido = await solicitarPermissaoNotificacao();
 
  if (!permitido) {
    return null;
  }
 
  const dataNotificacao = new Date(data);
 
  if (dataNotificacao <= new Date()) {
    console.log('A data da notificação precisa estar no futuro.');
    return null;
  }
 
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      sound: 'default',
      data: dados,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dataNotificacao,
    },
  });
 
  console.log('Notificação agendada:', id);
 
  return id;
}
 
// Cancela uma notificação específica
export async function cancelarNotificacao(id) {
  if (!id) {
    return;
  }
 
  await Notifications.cancelScheduledNotificationAsync(id);
}
 
// Lista as notificações que ainda estão agendadas
export async function listarNotificacoesAgendadas() {
  return await Notifications.getAllScheduledNotificationsAsync();
}