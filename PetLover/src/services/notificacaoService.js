import {
  addDoc,
  collection,
  Timestamp,
  doc,
  setDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

import { criarAgendamento } from './agendamento';

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

export async function salvarNotificacao({
  usuarioId,
  tipo,
  titulo,
  mensagem,
  data = new Date(),
  dados = {},
  chaveUnica = null,
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

    if (chaveUnica) {

      const referencia =
        doc(
          db,
          'notificacoes',
          chaveUnica
        );


      await setDoc(
        referencia,
        documento,
        {
          merge: false,
        }
      );


      console.log(
        'NOTIFICAÇÃO SALVA:',
        chaveUnica
      );


      return chaveUnica;
    }

    const referencia =
      await addDoc(
        collection(
          db,
          'notificacoes'
        ),
        documento
      );


    console.log(
      'NOTIFICAÇÃO SALVA:',
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
        erro:
          'Data do agendamento inválida.',
      };
    }


    const partesHorario =
      String(horario).split(':');


    const hora =
      Number(partesHorario[0]);

    const minuto =
      Number(partesHorario[1]);


    if (
      Number.isNaN(hora) ||
      Number.isNaN(minuto)
    ) {

      return {
        sucesso: false,
        erro:
          'Horário do agendamento inválido.',
      };
    }


    dataAgendamento.setHours(
      hora,
      minuto,
      0,
      0
    );


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


    if (
      !resultadoAgendamento.sucesso
    ) {

      return resultadoAgendamento;
    }


    const mensagemAgendamento =
      `${nomePet} tem um agendamento ` +
      `de ${servico} no dia ` +
      `${dataAgendamento.toLocaleDateString(
        'pt-BR'
      )} às ${horario}.`;


    const notificacaoId =
      await salvarNotificacao({

        usuarioId,

        tipo:
          'agendamento',

        titulo:
          'Agendamento realizado 🐾',

        mensagem:
          mensagemAgendamento,

        data:
          dataAgendamento,

        dados: {
          agendamentoId:
            resultadoAgendamento.id,
        },

        chaveUnica:
          `agendamento_${resultadoAgendamento.id}`,

      });


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

export async function verificarAvisosDeAgendamento(
  usuarioId,
  agendamentos = []
) {

  try {

    if (
      !usuarioId ||
      !Array.isArray(agendamentos)
    ) {

      return [];
    }


    const agora =
      new Date();


    const inicioHoje =
      new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate(),
        0,
        0,
        0,
        0
      );


    const fimHoje =
      new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate(),
        23,
        59,
        59,
        999
      );


    const avisosCriados = [];


    for (
      const agendamento
      of agendamentos
    ) {

      if (!agendamento) {
        continue;
      }


      let dataAgendamento;


      if (
        agendamento.data &&
        typeof agendamento.data.toDate ===
          'function'
      ) {

        dataAgendamento =
          agendamento.data.toDate();

      } else {

        dataAgendamento =
          new Date(
            agendamento.data
          );
      }


      if (
        Number.isNaN(
          dataAgendamento.getTime()
        )
      ) {

        continue;
      }


      const ehHoje =
        dataAgendamento.getTime() >=
          inicioHoje.getTime() &&
        dataAgendamento.getTime() <=
          fimHoje.getTime();


      const jaPassou =
        dataAgendamento.getTime() <
        agora.getTime();


      if (
        !ehHoje &&
        !jaPassou
      ) {

        continue;
      }


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


      const chaveAviso =
        `${agendamento.id || 'sem-id'}_${tipoAviso}`;


      const notificacaoId =
        await salvarNotificacao({

          usuarioId,

          tipo:
            tipoAviso,

          titulo,

          mensagem,

          data:
            new Date(),

          dados: {
            agendamentoId:
              agendamento.id || null,

            petId:
              agendamento.petId || null,

            chaveAviso,
          },

          chaveUnica:
            `aviso_${chaveAviso}`,

        });


      if (notificacaoId) {

        avisosCriados.push({

          id:
            notificacaoId,

          tipo:
            tipoAviso,

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

export async function criarNotificacoesGerais(
  usuarioId
) {

  try {

    if (!usuarioId) {
      return [];
    }


    const notificacoes = [];

    const ofertaId =
      await salvarNotificacao({

        usuarioId,

        tipo:
          'oferta',

        titulo:
          'Tem oferta especial para você! 🎁',

        mensagem:
          'Confira as ofertas especiais da PetLover.',

        data:
          new Date(),

        dados: {
          origem:
            'home',
        },

        chaveUnica:
          `geral_${usuarioId}_oferta`,

      });


    if (ofertaId) {

      notificacoes.push(
        ofertaId
      );
    }

    const servicoId =
      await salvarNotificacao({

        usuarioId,

        tipo:
          'servico',

        titulo:
          'Cuide ainda melhor do seu pet! ✨',

        mensagem:
          'Conheça nossos serviços e encontre o cuidado ideal para seu melhor amigo.',

        data:
          new Date(),

        dados: {
          origem:
            'home',
        },

        chaveUnica:
          `geral_${usuarioId}_servico`,

      });


    if (servicoId) {

      notificacoes.push(
        servicoId
      );
    }


    return notificacoes;

  } catch (error) {

    console.log(
      'ERRO AO CRIAR NOTIFICAÇÕES GERAIS:',
      error
    );

    return [];
  }
}