import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';
import { formatCivilDate } from '@/utils/civilDate';
import { router } from '@/lib/navigation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native-web';

export default function ResumoTattoo() {
  // Pega os dados da store e a função de salvar
  const { local, tamanho, estilo, data, horario } = useAgendamentoTatuagemStore();

  function handleConfirmar() {
    router.push('/agendamento-tatuagem/sucesso' as any);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Local: <Text style={styles.value}>{local}</Text></Text>
        <Text style={styles.label}>Tamanho: <Text style={styles.value}>{tamanho}</Text></Text>
        <Text style={styles.label}>Estilo: <Text style={styles.value}>{estilo}</Text></Text>
        <Text style={styles.label}>Data: <Text style={styles.value}>{formatCivilDate(data)}</Text></Text>
        <Text style={styles.label}>Horário: <Text style={styles.value}>{horario}</Text></Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleConfirmar}>
        <Text style={styles.btnText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#FFF', fontSize: 30, fontWeight: 'bold', marginTop: 50, marginBottom: 30 },
  card: { backgroundColor: '#1A1A1A', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  label: { color: '#888', fontSize: 16, marginBottom: 15 },
  value: { color: '#FFF', fontWeight: 'bold' },
  btn: { backgroundColor: '#A855F7', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
