import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native-web';
import { statusLabels, useAgendaDoDia } from '@/pages/admin/appointments';
import type { AdminAppointment } from '@/pages/admin/appointments';
import { formatCivilDate, toCivilDateString } from '@/utils/civilDate';

const mudarDia = (data: string, dias: number) => {
  const dia = new Date(`${data}T12:00:00`);
  dia.setDate(dia.getDate() + dias);
  return toCivilDateString(dia);
};

export default function AdminAgendaScreen() {
  const [dataEscolhida, setDataEscolhida] = useState<string>();
  const { agendamentos, data, carregando, erro, recarregar } = useAgendaDoDia(dataEscolhida);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda do dia</Text>

      <View style={styles.dayRow}>
        <TouchableOpacity
          style={styles.dayButton}
          disabled={!data}
          onPress={() => setDataEscolhida(mudarDia(data, -1))}
        >
          <Text style={styles.dayButtonText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.dayLabel}>{formatCivilDate(data)}</Text>

        <TouchableOpacity
          style={styles.dayButton}
          disabled={!data}
          onPress={() => setDataEscolhida(mudarDia(data, 1))}
        >
          <Text style={styles.dayButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>

      {dataEscolhida && (
        <TouchableOpacity style={styles.todayButton} onPress={() => setDataEscolhida(undefined)}>
          <Text style={styles.todayButtonText}>Voltar para hoje</Text>
        </TouchableOpacity>
      )}

      {carregando ? (
        <ActivityIndicator color="#FFF" style={styles.feedback} />
      ) : erro ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{erro}</Text>
          <TouchableOpacity style={styles.dayButton} onPress={() => void recarregar()}>
            <Text style={styles.dayButtonText}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item: AdminAppointment) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.feedbackText}>Nenhum agendamento para este dia.</Text>}
          renderItem={({ item }: { item: AdminAppointment }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.service}>{item.service} · {statusLabels[item.status]}</Text>
              </View>
            </View>
          )}
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
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 18,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  dayButton: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#3B3B3B',
  },
  dayButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dayLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  todayButton: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  todayButtonText: {
    color: '#B9B9BE',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  feedback: {
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  feedbackText: {
    color: '#B9B9BE',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171B',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C31',
  },
  time: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    width: 72,
  },
  cardContent: {
    flex: 1,
  },
  clientName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  service: {
    color: '#B9B9BE',
    fontSize: 14,
  },
});
