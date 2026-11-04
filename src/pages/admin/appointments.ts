import {
  buscarAgendaDoDia,
  type AdminAppointment,
  type AdminAppointmentStatus,
  type AdminAppointmentType,
} from '@/services/admin.service';
import { useCallback, useEffect, useRef, useState } from 'react';

export type { AdminAppointment, AdminAppointmentStatus, AdminAppointmentType };

export const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
} satisfies Record<AdminAppointmentStatus, string>;

export const typeLabels = {
  tatuagem: 'Tatuagem',
  piercing: 'Piercing',
} satisfies Record<AdminAppointmentType, string>;

export function useAgendaDoDia(data?: string) {
  const [agendamentos, setAgendamentos] = useState<AdminAppointment[]>([]);
  const [dataExibida, setDataExibida] = useState(data ?? '');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const ultimaBusca = useRef(0);

  const recarregar = useCallback(async () => {
    const busca = ++ultimaBusca.current;

    setCarregando(true);
    setErro('');

    try {
      const resposta = await buscarAgendaDoDia(data);

      if (busca !== ultimaBusca.current) return;

      setAgendamentos(resposta.agendamentos);
      setDataExibida(resposta.data);
    } catch (error: any) {
      if (busca !== ultimaBusca.current) return;

      setAgendamentos([]);
      setErro(error?.response?.data?.message || 'Não foi possível carregar a agenda.');
    } finally {
      if (busca === ultimaBusca.current) setCarregando(false);
    }
  }, [data]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { agendamentos, data: dataExibida, carregando, erro, recarregar };
}
