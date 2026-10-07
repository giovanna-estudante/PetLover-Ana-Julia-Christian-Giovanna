import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

/**
 * Cria um novo agendamento no Firestore.
 *
 * Este serviço NÃO utiliza expo-notifications.
 */
export async function criarAgendamento(agendamento) {
  try {
    console.log(
      'INICIANDO SALVAMENTO DO AGENDAMENTO...'
    );

    console.log(
      'Dados:',
      agendamento
    );

    const documento = {
      usuarioId: agendamento.usuarioId,

      petId:
        agendamento.petId ||
        'pet-principal',

      nomePet:
        agendamento.nomePet,

      servico:
        agendamento.servico,

      data:
        Timestamp.fromDate(
          agendamento.data
        ),

      horario:
        agendamento.horario,

      status:
        'agendado',

      criadoEm:
        Timestamp.now(),
    };

    const referencia =
      await addDoc(
        collection(
          db,
          'agendamentos'
        ),
        documento
      );

    console.log(
      'AGENDAMENTO SALVO COM SUCESSO:',
      referencia.id
    );

    return {
      sucesso: true,
      id: referencia.id,
    };
  } catch (error) {
    console.log(
      'ERRO AO SALVAR AGENDAMENTO:'
    );

    console.log(
      'Código:',
      error.code
    );

    console.log(
      'Mensagem:',
      error.message
    );

    console.log(
      'Erro completo:',
      error
    );

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

/**
 * Busca todos os agendamentos
 * de um determinado usuário.
 */
export async function buscarAgendamentos(
  usuarioId
) {
  try {
    const consulta =
      query(
        collection(
          db,
          'agendamentos'
        ),
        where(
          'usuarioId',
          '==',
          usuarioId
        ),
        orderBy(
          'data',
          'asc'
        )
      );

    const resultado =
      await getDocs(
        consulta
      );

    const agendamentos =
      resultado.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

    return {
      sucesso: true,
      agendamentos,
    };
  } catch (error) {
    console.log(
      'Erro ao buscar agendamentos:',
      error
    );

    return {
      sucesso: false,
      erro: error.message,
      agendamentos: [],
    };
  }
}

/**
 * Busca os horários que já estão ocupados
 * em uma determinada data.
 *
 * dataSelecionada deve estar no formato:
 * YYYY-MM-DD
 */
export async function buscarHorariosOcupados(
  dataSelecionada
) {
  try {
    const [
      ano,
      mes,
      dia,
    ] =
      dataSelecionada
        .split('-')
        .map(Number);

    const inicio =
      new Date(
        ano,
        mes - 1,
        dia,
        0,
        0,
        0
      );

    const fim =
      new Date(
        ano,
        mes - 1,
        dia,
        23,
        59,
        59
      );

    const consulta =
      query(
        collection(
          db,
          'agendamentos'
        ),
        where(
          'data',
          '>=',
          Timestamp.fromDate(
            inicio
          )
        ),
        where(
          'data',
          '<=',
          Timestamp.fromDate(
            fim
          )
        )
      );

    const resultado =
      await getDocs(
        consulta
      );

    const horariosOcupados =
      resultado.docs
        .map(
          (documento) =>
            documento.data()
              .horario
        )
        .filter(Boolean);

    return {
      sucesso: true,
      horarios:
        horariosOcupados,
    };
  } catch (error) {
    console.log(
      'Erro ao buscar horários ocupados:',
      error
    );

    return {
      sucesso: false,
      horarios: [],
      erro: error.message,
      codigo: error.code,
    };
  }
}
