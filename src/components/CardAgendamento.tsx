import { formatCivilDate } from '@/utils/civilDate';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native-web';

interface AgendamentoProps {
  cliente: string;
  data: string;
  servico: string;
  status: string;
}

export default function CardAgendamento({ cliente, data, servico, status }: AgendamentoProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cliente}>{cliente}</Text>
      <Text style={styles.text}>Serviço: {servico}</Text>
      <Text style={styles.text}>Data: {formatCivilDate(data)}</Text>
      <Text style={status === 'Concluído' ? styles.concluido : styles.agendado}>
        Status: {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#1A1A1A', 
  },
  cliente: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFF',
  },
  text: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 2,
  },
  concluido: {
    fontSize: 14,
    color: '#4CAF50', 
    fontWeight: 'bold',
    marginTop: 4,
  },
  agendado: {
    fontSize: 14,
    color: '#FF9800', 
    fontWeight: 'bold',
    marginTop: 4,
  },
});
