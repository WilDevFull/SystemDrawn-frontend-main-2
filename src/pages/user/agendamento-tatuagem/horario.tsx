import { router } from '@/lib/navigation';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native-web';
import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';

const horariosDisponiveis = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function HorarioTatuagemScreen() {
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const setHorario = useAgendamentoTatuagemStore((state) => state.setHorario);

  function handleContinue() {
    if (!horarioSelecionado) return;
    setHorario(horarioSelecionado);
    // APONTANDO PARA O RESUMO
    router.push('/agendamento-tatuagem/resumo' as any);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horário</Text>
      <Text style={styles.subtitle}>Escolha o horário disponível</Text>
      <View style={styles.progressBar}><View style={styles.progressFill} /></View>
      <Text style={styles.step}>Etapa 5 de 5</Text>

      <View style={styles.grid}>
        {horariosDisponiveis.map((horario) => (
          <TouchableOpacity
            key={horario}
            style={[styles.card, horarioSelecionado === horario && styles.cardSelected]}
            onPress={() => setHorarioSelecionado(horario)}
          >
            <Text style={[styles.cardText, horarioSelecionado === horario && styles.cardTextSelected]}>
              {horario}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, !horarioSelecionado && styles.btnDisabled]}
        disabled={!horarioSelecionado}
        onPress={handleContinue}
      >
        <Text style={styles.btnText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#FFF', fontSize: 30, fontWeight: 'bold', marginTop: 30 },
  subtitle: { color: '#AAA', marginBottom: 20 },
  progressBar: { height: 6, backgroundColor: '#222', borderRadius: 10, marginBottom: 10 },
  progressFill: { width: '100%', height: '100%', backgroundColor: '#A855F7', borderRadius: 10 },
  step: { color: '#A855F7', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: { width: '47%', backgroundColor: '#1A1A1A', borderRadius: 20, height: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  cardSelected: { backgroundColor: '#A855F7', borderColor: '#FFF', borderWidth: 2 },
  cardText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  cardTextSelected: { color: '#FFF' },
  btn: { backgroundColor: '#A855F7', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 30 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
