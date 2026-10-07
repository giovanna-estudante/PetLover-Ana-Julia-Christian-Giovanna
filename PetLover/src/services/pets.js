import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const colecaoPets = collection(db, 'pets');

export async function buscarPets(usuarioId) {
  try {
    const consulta = query(
      colecaoPets,
      where('usuarioId', '==', usuarioId)
    );

    const resultado = await getDocs(consulta);

    const pets = resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));

    return {
      sucesso: true,
      pets,
    };
  } catch (error) {
    console.log('Erro ao buscar pets:', error);

    return {
      sucesso: false,
      pets: [],
      erro: error.message,
    };
  }
}

export async function criarPet({
  usuarioId,
  nome,
  especie,
  raca,
  idade,
}) {
  try {
    const referencia = await addDoc(colecaoPets, {
      usuarioId,
      nome,
      especie,
      raca,
      idade,
      criadoEm: serverTimestamp(),
    });

    return {
      sucesso: true,
      id: referencia.id,
    };
  } catch (error) {
    console.log('Erro ao criar pet:', error);

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

export async function editarPet(petId, dados) {
  try {
    const referencia = doc(db, 'pets', petId);

    await updateDoc(referencia, {
      nome: dados.nome,
      especie: dados.especie,
      raca: dados.raca,
      idade: dados.idade,
    });

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao editar pet:', error);

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

export async function excluirPet(petId) {
  try {
    const referencia = doc(db, 'pets', petId);

    await deleteDoc(referencia);

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao excluir pet:', error);

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}