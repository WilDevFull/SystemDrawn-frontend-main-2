import { api } from './api';

export type AdminAppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type AdminAppointmentType = 'tatuagem' | 'piercing';

export type AdminAppointment = {
  id: string;
  type: AdminAppointmentType;
  appointmentId: string;
  date: string;
  time: string;
  clientName: string;
  service: string;
  status: AdminAppointmentStatus;
};

type AgendaResponse = {
  data: string;
  total: number;
  agendamentos: AdminAppointment[];
};

type AprovacoesResponse = {
  total: number;
  agendamentos: AdminAppointment[];
};

type DecisaoResponse = {
  message: string;
  agendamento: AdminAppointment;
  notificacaoEnviada: boolean;
};

type Decisao = 'aprovar' | 'recusar';

const caminhoDaDecisao = (agendamento: AdminAppointment, decisao: Decisao) =>
  `/admin/agendamentos/${agendamento.type}/${encodeURIComponent(agendamento.appointmentId)}/${decisao}`;

export async function buscarAgendaDoDia(data?: string) {
  const response = await api.get<AgendaResponse>('/admin/agenda', {
    params: data ? { data } : undefined,
  });

  return response.data;
}

export async function buscarAprovacoesPendentes() {
  const response = await api.get<AprovacoesResponse>('/admin/aprovacoes');

  return response.data;
}

export async function aprovarAgendamento(agendamento: AdminAppointment) {
  const response = await api.patch<DecisaoResponse>(caminhoDaDecisao(agendamento, 'aprovar'));

  return response.data;
}

export async function recusarAgendamento(agendamento: AdminAppointment, motivo?: string) {
  const response = await api.patch<DecisaoResponse>(caminhoDaDecisao(agendamento, 'recusar'), {
    motivo,
  });

  return response.data;
}
