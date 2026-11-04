import { create } from 'zustand';

export interface Agendamento {
  id: string;

  local: string;

  tipoPiercing: string;
  tipoPiercingId: string;

  joia: string;
  joiaId: string;

  data: string;
  horario: string;

  observacao?: string;
}

interface AgendamentoPiercingState {
  local: string;

  tipoPiercing: string;
  tipoPiercingId: string;

  joia: string;
  joiaId: string;

  data: string;
  horario: string;

  observacao: string;

  meusAgendamentos: Agendamento[];

  setLocal: (
    local: string
  ) => void;

  setTipoPiercing: (
    tipo: string,
    id: string
  ) => void;

  setJoia: (
    joia: string,
    id: string
  ) => void;

  setData: (
    data: string
  ) => void;

  setHorario: (
    horario: string
  ) => void;

  setObservacao: (
    observacao: string
  ) => void;

  reset: () => void;
}

export const
useAgendamentoPiercingStore =
create<AgendamentoPiercingState>(
(set) => ({

  /**
   * Estado inicial
   */
  local: '',

  tipoPiercing: '',
  tipoPiercingId: '',

  joia: '',
  joiaId: '',

  data: '',
  horario: '',

  observacao: '',

  meusAgendamentos: [],

  /**
   * Setters
   */
  setLocal: (
    local: string
  ) =>
    set({
      local,
    }),

  setTipoPiercing: (
    tipoPiercing: string,
    tipoPiercingId: string
  ) =>
    set({
      tipoPiercing,
      tipoPiercingId,
    }),

  setJoia: (
    joia: string,
    joiaId: string
  ) =>
    set({
      joia,
      joiaId,
    }),

  setData: (
    data: string
  ) =>
    set({
      data,
    }),

  setHorario: (
    horario: string
  ) =>
    set({
      horario,
    }),

  setObservacao: (
    observacao: string
  ) =>
    set({
      observacao,
    }),

  /**
   * Limpar fluxo
   */
  reset: () =>
    set({

      local: '',

      tipoPiercing: '',
      tipoPiercingId: '',

      joia: '',
      joiaId: '',

      data: '',
      horario: '',

      observacao: '',
    }),
}));