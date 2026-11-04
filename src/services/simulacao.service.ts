import { api } from './api';

// Membros que o cliente pode escolher (os mesmos do backend e da tela de agendamento).
export const MEMBROS = ['Braço', 'Perna', 'Costas', 'Peito', 'Pescoço', 'Mão'] as const;
export type Membro = (typeof MEMBROS)[number];

// O backend pode levar até ~140s (30s para conectar na IA + 80s para gerar +
// 30s para baixar a imagem), então esta chamada espera mais que os 90s do api.ts.
const LIMITE_SIMULACAO_MS = 150000;

export interface SimulacaoResponse {
  sucesso: boolean;
  imagemSimulada: string;
  
  modoTeste?: boolean;
  aviso?: string;
  erro?: string;
}

export async function simularTatuagemIA(
  imagemTatuagemBase64: string,
  membro: Membro,
  promptText?: string
): Promise<SimulacaoResponse> {
  const response = await api.post<SimulacaoResponse>(
    '/simulacao',
    { imagemTatuagemBase64, membro, promptText },
    { timeout: LIMITE_SIMULACAO_MS }
  );

  return response.data;
}

export const DESCRICAO_MINIMA = 3;
export const DESCRICAO_MAXIMA = 300;

export async function simularTatuagemPorTexto(
  descricao: string,
  membro: Membro
): Promise<SimulacaoResponse> {
  const response = await api.post<SimulacaoResponse>(
    '/simulacao/texto',
    { descricao, membro },
    { timeout: LIMITE_SIMULACAO_MS }
  );

  return response.data;
}
