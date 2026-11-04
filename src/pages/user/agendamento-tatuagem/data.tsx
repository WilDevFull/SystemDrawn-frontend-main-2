import { formatCivilDate, toCivilDateString } from '@/utils/civilDate';
import { router } from '@/lib/navigation';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Calendar } from '@/components/Calendar';

// IMPORTANTE: Aqui usamos a store de TATUAGEM
import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';

export default function DataTattooScreen() {
  const [selectedDate, setSelectedDate] = useState('');

  // Usando a função da store de tatuagem
  const setData = useAgendamentoTatuagemStore(
    (state) => state.setData
  );

  function handleContinue() {
    if (!selectedDate) return;

    setData(selectedDate);

    // Rota para a próxima etapa da tatuagem
    router.push('/agendamento-tatuagem/horario' as any);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data</Text>

      <Text style={styles.subtitle}>
        Escolha a data do agendamento
      </Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.step}>
        Etapa 4 de 5
      </Text>

      <View style={styles.calendarContainer}>
        <Calendar
          minDate={toCivilDateString(new Date())}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#A855F7',
            },
          }}
          theme={{
            backgroundColor: '#1A1A1A',
            calendarBackground: '#1A1A1A',
            textSectionTitleColor: '#888',
            selectedDayBackgroundColor: '#A855F7',
            selectedDayTextColor: '#FFF',
            todayTextColor: '#A855F7',
            dayTextColor: '#FFF',
            textDisabledColor: '#444',
            monthTextColor: '#FFF',
            arrowColor: '#A855F7',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 20,
          }}
        />
      </View>

      {selectedDate ? (
        <Text style={styles.selectedDate}>
          Data selecionada:{' '}
          {formatCivilDate(selectedDate)}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.btn,
          !selectedDate && styles.btnDisabled,
        ]}
        disabled={!selectedDate}
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
  progressFill: { width: '80%', height: '100%', backgroundColor: '#A855F7', borderRadius: 10 },
  step: { color: '#A855F7', marginBottom: 20 },
  calendarContainer: { backgroundColor: '#1A1A1A', borderRadius: 20, overflow: 'hidden', padding: 10 },
  selectedDate: { color: '#FFF', marginTop: 20, textAlign: 'center', fontSize: 16 },
  btn: { backgroundColor: '#A855F7', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 30 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
