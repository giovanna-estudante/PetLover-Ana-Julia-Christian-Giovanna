import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import { auth } from '../config/firebase';

export async function cadastrar(email, senha) {
  try {
    const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    return {
      sucesso: true,
      user: resultado.user,
    };
  } catch (error) {
    console.log('Erro ao cadastrar:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

export async function entrar(email, senha) {
  try {
    const resultado = await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

    return {
      sucesso: true,
      user: resultado.user,
    };
  } catch (error) {
    console.log('Erro ao entrar:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

export async function sair() {
  try {
    await signOut(auth);

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao sair:', error);

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

export async function alterarEmail(novoEmail) {
  try {
    if (!auth.currentUser) {
      return {
        sucesso: false,
        erro: 'Usuário não encontrado.',
      };
    }

    await updateEmail(auth.currentUser, novoEmail);

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao alterar e-mail:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

export async function alterarSenha(novaSenha) {
  try {
    if (!auth.currentUser) {
      return {
        sucesso: false,
        erro: 'Usuário não encontrado.',
      };
    }

    await updatePassword(
      auth.currentUser,
      novaSenha
    );

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao alterar senha:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

export async function reautenticar(senhaAtual) {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      return {
        sucesso: false,
        erro: 'Usuário não encontrado.',
      };
    }

    const credencial =
      EmailAuthProvider.credential(
        auth.currentUser.email,
        senhaAtual
      );

    await reauthenticateWithCredential(
      auth.currentUser,
      credencial
    );

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao reautenticar:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}

export async function excluirConta() {
  try {
    if (!auth.currentUser) {
      return {
        sucesso: false,
        erro: 'Usuário não encontrado.',
      };
    }

    await deleteUser(auth.currentUser);

    return {
      sucesso: true,
    };
  } catch (error) {
    console.log('Erro ao excluir conta:', error);

    return {
      sucesso: false,
      erro: error.message,
      codigo: error.code,
    };
  }
}