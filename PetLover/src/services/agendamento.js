import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
 
import { db } from '../config/firebase';
 
// Cria um novo agendamento
export async function criarAgendamento(agendamento) {
  try {
    const referencia = await addDoc(
      collection(db, 'agendamentos'),
      {
        ...agendamento,
        criadoEm: new Date(),
      }
    );
 
    return {
      sucesso: true,
      id: referencia.id,
    };
  } catch (error) {
    console.log('Erro ao criar agendamento:', error);
 
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}
 
// Busca os agendamentos de um usuário
export async function buscarAgendamentos(usuarioId) {
  try {
    const consulta = query(
      collection(db, 'agendamentos'),
      where('usuarioId', '==', usuarioId),
      orderBy('data', 'asc')
    );
 
    const resultado = await getDocs(consulta);
 
    const agendamentos = resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
 
    return {
      sucesso: true,
      agendamentos,
    };
  } catch (error) {
    console.log('Erro ao buscar agendamentos:', error);
 
    return {
      sucesso: false,
      erro: error.message,
      agendamentos: [],
    };
  }
}