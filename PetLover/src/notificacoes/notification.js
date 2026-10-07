/*
 * PetLover - Notificações
 *
 * O PetLover não utiliza mais expo-notifications.
 *
 * As notificações agora são salvas no Firestore
 * na coleção "notificacoes" e aparecem dentro
 * do próprio aplicativo.
 *
 * Não existem:
 * - notificações push
 * - notificações locais agendadas
 * - permissões de notificação do Android
 * - expo-notifications neste fluxo
 */

/**
 * Compatibilidade com código antigo.
 *
 * O novo sistema não precisa solicitar
 * permissão ao sistema operacional.
 */
export async function solicitarPermissaoNotificacao() {
  return true;
}

/**
 * Compatibilidade com código antigo.
 *
 * O novo sistema não agenda notificações
 * no dispositivo.
 */
export async function agendarNotificacao() {
  return null;
}

/**
 * Compatibilidade com código antigo.
 *
 * Não existem notificações locais para cancelar.
 */
export async function cancelarNotificacao() {
  return null;
}

/**
 * Compatibilidade com código antigo.
 *
 * O novo sistema não possui notificações
 * agendadas no dispositivo.
 */
export async function listarNotificacoesAgendadas() {
  return [];
}

/**
 * Compatibilidade com código antigo.
 */
export async function cancelarTodasNotificacoes() {
  return null;
}