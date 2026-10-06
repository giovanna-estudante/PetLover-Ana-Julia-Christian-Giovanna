import {
  agendarNotificacao,
} from '../notificacoes/notification';
 
import {
  criarAgendamento,
} from './agendamento';
 
// Cria o agendamento e agenda a notificação
export async function criarAgendamentoComNotificacao({
  usuarioId,
  petId,
  nomePet,
  servico,
  data,
  horario,
}) {
  try {
    const dataAgendamento = new Date(data);
 
    const [hora, minuto] = horario.split(':');
 
    dataAgendamento.setHours(
      Number(hora),
      Number(minuto),
      0,
      0
    );
 
    // Salva o agendamento no Firebase
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
 
    // Cria a notificação
    const idNotificacao = await agendarNotificacao({
      titulo: 'PetLover 🐾',
      mensagem: `Lembrete: ${nomePet} tem um agendamento de ${servico} às ${horario}.`,
      data: new Date(
        dataAgendamento.getTime() - 24 * 60 * 60 * 1000
      ),
      dados: {
        tipo: 'agendamento',
        agendamentoId: resultadoAgendamento.id,
      },
    });
 
    return {
      sucesso: true,
      agendamentoId: resultadoAgendamento.id,
      notificacaoId: idNotificacao,
    };
  } catch (error) {
    console.log(
      'Erro ao criar agendamento com notificação:',
      error
    );
 
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}