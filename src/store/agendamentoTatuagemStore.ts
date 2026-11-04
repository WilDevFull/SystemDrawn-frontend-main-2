import { create } from 'zustand';

interface AgendamentoTatuagemState {
  /**
   * Estilo da tatuagem.
   * Ex: Realismo, Old School, Blackwork...
   */
  estilo: string;

  /**
   * Tamanho da tatuagem.
   * Ex: Micro, Pequena, Média, Grande, Extra Grande
   */
  tamanho: string;

  /**
   * Local do corpo.
   * Ex: Braço, Perna, Costas...
   */
  local: string;

  /**
   * Data do agendamento.
   * Formato: YYYY-MM-DD
   */
  data: string;

  /**
   * Horário do agendamento.
   * Ex: '14:00'
   */
  horario: string;

  /**
   * Setters
   */
  setEstilo: (estilo: string) => void;
  setTamanho: (tamanho: string) => void;
  setLocal: (local: string) => void;
  setData: (data: string) => void;
  setHorario: (horario: string) => void;

  /**
   * Limpa store ao fim do fluxo.
   */
  reset: () => void;
}

export const useAgendamentoTatuagemStore =
  create<AgendamentoTatuagemState>(
    (set) => ({
      estilo: '',
      tamanho: '',
      local: '',
      data: '',
      horario: '',

      setEstilo: (estilo) =>
        set({ estilo }),

      setTamanho: (tamanho) =>
        set({ tamanho }),

      setLocal: (local) =>
        set({ local }),

      setData: (data) =>
        set({ data }),

      setHorario: (horario) =>
        set({ horario }),

      reset: () =>
        set({
          estilo: '',
          tamanho: '',
          local: '',
          data: '',
          horario: '',
        }),
    })
  );