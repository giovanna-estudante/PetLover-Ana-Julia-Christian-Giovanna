import {
  addDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { criarAgendamento } from './agendamento';

/*
 * Converte a data "YYYY-MM-DD" para uma data local.
 * Isso evita problemas de fuso horário.
 */
function criarDataLocal(data) {
  if (data instanceof Date) {
    return new Date(data);
  }

  if (typeof data !== 'string') {
    return new Date(data);
  }

  const partes = data.split('-');

  if (partes.length !== 3) {
    return new Date(data);
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  return new Date(
    ano,
    mes - 1,
    dia,
    0,
    0,
    0,
    0
  );
}

/*
 * Salva uma notificação no histórico do Firebase.
 *
 * IMPORTANTE:
 * Aqui não existe mais expo-notifications.
 * A notificação é apenas registrada no histórico
 * para aparecer dentro do aplicativo.
 */
async function salvarNotificacao({
  usuarioId,
  tipo,
  titulo,
  mensagem,
  data,
  dados = {},
}) {
  try {
    const documento = {
      usuarioId,
      tipo,
      titulo,
      mensagem,
      data: Timestamp.fromDate(data),
      criadoEm: Timestamp.now(),
      lida: false,
      dados,
    };

    const referencia = await addDoc(
      collection(db, 'notificacoes'),
      documento
    );

    console.log(
      'NOTIFICAÇÃO SALVA NO HISTÓRICO:',
      referencia.id
    );

    return referencia.id;
  } catch (error) {
    console.log(
      'ERRO AO SALVAR NOTIFICAÇÃO:',
      error
    );

    return null;
  }
}

/*
 * Cria o agendamento e registra um aviso
 * imediatamente no histórico.
 *
 * NÃO agenda nenhuma notificação no Android.
 */
export async function criarAgendamentoComNotificacao({
  usuarioId,
  petId,
  nomePet,
  servico,
  data,
  horario,
}) {
  try {
    const dataAgendamento =
      criarDataLocal(data);

    if (
      Number.isNaN(
        dataAgendamento.getTime()
      )
    ) {
      return {
        sucesso: false,
        erro: 'Data do agendamento inválida.',
      };
    }

    /*
     * Coloca o horário escolhido pelo usuário
     * dentro da data do agendamento.
     */
    const partesHorario =
      String(horario).split(':');

    const hora = Number(
      partesHorario[0]
    );

    const minuto = Number(
      partesHorario[1]
    );

    if (
      Number.isNaN(hora) ||
      Number.isNaN(minuto)
    ) {
      return {
        sucesso: false,
        erro: 'Horário do agendamento inválido.',
      };
    }

    dataAgendamento.setHours(
      hora,
      minuto,
      0,
      0
    );

    console.log(
      'DATA DO AGENDAMENTO:',
      dataAgendamento
    );

    /*
     * O agendamento precisa estar no futuro.
     */
    if (
      dataAgendamento.getTime() <=
      Date.now()
    ) {
      return {
        sucesso: false,
        erro:
          'O agendamento precisa ser no futuro.',
      };
    }

    /*
     * 1. Salva o agendamento no Firebase.
     */
    const resultadoAgendamento =
      await criarAgendamento({
        usuarioId,
        petId,
        nomePet,
        servico,
        data: dataAgendamento,
        horario,
        status: 'agendado',
      });

    if (!resultadoAgendamento.sucesso) {
      return resultadoAgendamento;
    }

    /*
     * 2. Cria imediatamente uma notificação
     * no histórico do aplicativo.
     */
    const mensagemAgendamento =
      `${nomePet} tem um agendamento ` +
      `de ${servico} no dia ` +
      `${dataAgendamento.toLocaleDateString(
        'pt-BR'
      )} às ${horario}.`;

    const notificacaoId =
      await salvarNotificacao({
        usuarioId,
        tipo: 'agendamento',
        titulo:
          'Agendamento realizado 🐾',
        mensagem:
          mensagemAgendamento,
        data: dataAgendamento,
        dados: {
          agendamentoId:
            resultadoAgendamento.id,
        },
      });

    /*
     * NÃO existe mais:
     *
     * - aviso 24 horas antes
     * - scheduleNotificationAsync
     * - expo-notifications
     * - notificação em segundo plano
     */

    return {
      sucesso: true,
      agendamentoId:
        resultadoAgendamento.id,
      notificacaoId,
    };
  } catch (error) {
    console.log(
      'ERRO AO CRIAR AGENDAMENTO COM NOTIFICAÇÃO:',
      error
    );

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

/*
 * Verifica os agendamentos quando o usuário
 * abre o aplicativo.
 *
 * Regras:
 *
 * - agendamento futuro → nenhum aviso
 * - agendamento de hoje → aviso de compromisso hoje
 * - agendamento que já passou → aviso de compromisso passado
 *
 * Para evitar criar o mesmo aviso várias vezes,
 * usamos um campo de controle no documento:
 *
 * dados.tipoAviso
 */
export async function verificarAvisosDeAgendamento(
  usuarioId,
  agendamentos = []
) {
  try {
    if (!usuarioId || !Array.isArray(agendamentos)) {
      return [];
    }

    const agora = new Date();

    /*
     * Data de hoje sem horário.
     */
    const inicioHoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      0,
      0,
      0,
      0
    );

    const fimHoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      23,
      59,
      59,
      999
    );

    const avisosCriados = [];

    for (const agendamento of agendamentos) {
      if (!agendamento) {
        continue;
      }

      /*
       * Converte a data do Firebase para Date.
       */
      let dataAgendamento;

      if (
        agendamento.data &&
        typeof agendamento.data.toDate ===
          'function'
      ) {
        dataAgendamento =
          agendamento.data.toDate();
      } else if (
        agendamento.data instanceof Date
      ) {
        dataAgendamento =
          new Date(agendamento.data);
      } else {
        dataAgendamento =
          new Date(agendamento.data);
      }

      if (
        Number.isNaN(
          dataAgendamento.getTime()
        )
      ) {
        continue;
      }

      /*
       * Verifica se o agendamento é hoje.
       */
      const ehHoje =
        dataAgendamento.getTime() >=
          inicioHoje.getTime() &&
        dataAgendamento.getTime() <=
          fimHoje.getTime();

      /*
       * Verifica se o agendamento já passou.
       */
      const jaPassou =
        dataAgendamento.getTime() <
        agora.getTime();

      /*
       * FUTURO:
       * Não fazemos nada.
       */
      if (!ehHoje && !jaPassou) {
        continue;
      }

      /*
       * Define qual aviso deve ser criado.
       */
      let tipoAviso;
      let titulo;
      let mensagem;

      if (jaPassou) {
        tipoAviso =
          'agendamento_passado';

        titulo =
          'Compromisso já passou ⚠️';

        mensagem =
          `Você tinha um agendamento de ` +
          `${agendamento.servico || 'serviço'} ` +
          `para ${agendamento.nomePet || 'seu pet'} ` +
          `às ${agendamento.horario}.`;
      } else {
        tipoAviso =
          'agendamento_hoje';

        titulo =
          'Seu compromisso é hoje! 🐾';

        mensagem =
          `O ${agendamento.servico || 'serviço'} ` +
          `do ${agendamento.nomePet || 'seu pet'} ` +
          `está marcado para hoje às ` +
          `${agendamento.horario}.`;
      }

      /*
       * Identificador único para esse aviso.
       *
       * Assim podemos evitar duplicação.
       */
      const chaveAviso =
        `${agendamento.id || 'sem-id'}_${tipoAviso}`;

      /*
       * Por enquanto verificamos no próprio objeto
       * se esse aviso já foi marcado.
       */
      if (
        agendamento.avisos &&
        agendamento.avisos[tipoAviso]
      ) {
        continue;
      }

      const dataAviso = new Date();

      const notificacaoId =
        await salvarNotificacao({
          usuarioId,
          tipo: tipoAviso,
          titulo,
          mensagem,
          data: dataAviso,
          dados: {
            agendamentoId:
              agendamento.id || null,
            petId:
              agendamento.petId || null,
            chaveAviso,
          },
        });

      if (notificacaoId) {
        avisosCriados.push({
          id: notificacaoId,
          tipo: tipoAviso,
        });
      }
    }

    return avisosCriados;
  } catch (error) {
    console.log(
      'ERRO AO VERIFICAR AVISOS DE AGENDAMENTO:',
      error
    );

    return [];
  }
}