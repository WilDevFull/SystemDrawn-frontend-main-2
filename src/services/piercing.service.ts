import { api }
from './api';

/**
 * Buscar tipos
 * de piercing.
 */
export async function
buscarTiposPiercing(
  token: string
) {

  const response =
    await api.get(
      '/tipos-piercing',
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data.data;
}

/**
 * Buscar joias.
 */
export async function
buscarJoias(
  token: string
) {

  const response =
    await api.get(
      '/joias-piercing',
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data.joias;
}

/**
 * Criar agendamento.
 */
export async function
criarAgendamentoPiercing(
  dados: {
    tipo_piercing_id: string;
    joia_piercing_id: string;
    data: string;
    horario: string;
    observacao?: string;
  },
  token: string
) {

  const response =
    await api.post(
      '/agendamentos-piercing',
      dados,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}

/**
 * Listar meus
 * agendamentos.
 */
export async function
listarAgendamentosPiercing(
  token: string
) {

  const response =
    await api.get(
      '/agendamentos-piercing',
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}

/**
 * Reagendar /
 * editar agendamento.
 */
export async function
editarAgendamentoPiercing(
  id: string,

  dados: {
    data?: string;
    horario?: string;
    observacao?: string;
  },

  token: string
) {

  const response =
    await api.put(
      `/agendamentos-piercing/${id}`,
      dados,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}

/**
 * Cancelar /
 * excluir agendamento.
 */
export async function
cancelarAgendamentoPiercing(
  id: string,
  token: string
) {

  const response =
    await api.delete(
      `/agendamentos-piercing/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}