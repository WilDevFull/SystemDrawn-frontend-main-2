import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native-web';
import { Alert } from '@/lib/alert';
import { typeLabels } from '@/pages/admin/appointments';
import {
  aprovarAgendamento,
  buscarAprovacoesPendentes,
  recusarAgendamento,
  type AdminAppointment,
} from '@/services/admin.service';
import { formatCivilDate } from '@/utils/civilDate';

type Decision = 'aprovar' | 'recusar';

export default function AdminApprovalsScreen() {
  const [requests, setRequests] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalPending = useMemo(() => requests.length, [requests]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const response = await buscarAprovacoesPendentes();
      setRequests(response.agendamentos);
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Não foi possível carregar os pedidos pendentes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const decide = async (item: AdminAppointment, decision: Decision, motivo?: string) => {
    setBusyId(item.id);

    try {
      const result =
        decision === 'aprovar'
          ? await aprovarAgendamento(item)
          : await recusarAgendamento(item, motivo);

      setRequests((current) => current.filter((request) => request.id !== item.id));

      if (!result.notificacaoEnviada) {
        Alert.alert('Atenção', `${result.message} Mas não foi possível avisar o cliente.`);
      }
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message || 'Não foi possível concluir a ação.');
      void loadRequests();
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (item: AdminAppointment) => {
    Alert.alert(
      'Aprovar pedido',
      `Aprovar ${item.service} de ${item.clientName} no dia ${formatCivilDate(item.date)} às ${item.time}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aprovar', onPress: () => decide(item, 'aprovar') },
      ],
    );
  };

  const handleReject = (item: AdminAppointment) => {
    const answer = window.prompt(
      `Recusar o pedido de ${item.clientName}?\n\nSe quiser, escreva o motivo. Ele será enviado ao cliente.`,
    );

    if (answer === null) return;

    void decide(item, 'recusar', answer.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aprovações</Text>
        <Text style={styles.counter}>{totalPending} pendentes</Text>
      </View>

      <TouchableOpacity
        style={styles.stockButton}
        onPress={() => {}}
      >
        <Text style={styles.stockButtonText}>Controle de Estoque de Materiais</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color="#FFF" style={styles.feedback} />
      ) : loadError ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{loadError}</Text>
          <TouchableOpacity style={styles.stockButton} onPress={() => void loadRequests()}>
            <Text style={styles.stockButtonText}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item: AdminAppointment) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.feedbackText}>Nenhum pedido esperando aprovação.</Text>}
          renderItem={({ item }: { item: AdminAppointment }) => {
            const busy = busyId === item.id;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.clientName}>{item.clientName}</Text>
                  <Text style={styles.style}>{item.service}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Data:</Text>
                  <Text style={styles.value}>{formatCivilDate(item.date)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Horário:</Text>
                  <Text style={styles.value}>{item.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tipo:</Text>
                  <Text style={styles.value}>{typeLabels[item.type]}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton, busy && styles.actionButtonBusy]}
                    disabled={busy}
                    onPress={() => handleApprove(item)}
                  >
                    <Text style={styles.actionText}>{busy ? 'Enviando...' : 'Aprovar'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton, busy && styles.actionButtonBusy]}
                    disabled={busy}
                    onPress={() => handleReject(item)}
                  >
                    <Text style={styles.actionText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
  counter: {
    color: '#B7B7B7',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 28,
  },
  feedback: {
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  feedbackText: {
    color: '#B7B7B7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
  stockButton: {
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#3B3B3B',
  },
  stockButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#17171B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C31',
  },
  cardHeader: {
    marginBottom: 14,
  },
  clientName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  style: {
    color: '#D4D4D4',
    fontSize: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#98989D',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonBusy: {
    opacity: 0.6,
  },
  approveButton: {
    backgroundColor: '#1F7A47',
  },
  rejectButton: {
    backgroundColor: '#A52A2A',
  },
  actionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
