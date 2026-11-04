import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';
import { router } from '@/lib/navigation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native-web';

export default function SucessoTattoo() {
  const { reset } = useAgendamentoTatuagemStore();

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.title}>Agendado!</Text>

      {/* Botão para voltar ao início */}
      <TouchableOpacity 
        style={styles.btnPrimary} 
        onPress={() => { reset(); router.push('/home' as any); }}
      >
        <Text style={styles.btnText}>Voltar para Home</Text>
      </TouchableOpacity>

      {/* Botão para ver os agendamentos feitos */}
      <TouchableOpacity 
        style={styles.btnSecondary} 
        onPress={() => router.push('/meus-agendamentos' as any)}
      >
        <Text style={styles.btnText}>Ver meus agendamentos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  circle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A1A1A', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  check: { color: '#A855F7', fontSize: 40, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 40 },
  btnPrimary: { backgroundColor: '#A855F7', width: '100%', padding: 20, borderRadius: 18, alignItems: 'center', marginBottom: 15 },
  btnSecondary: { backgroundColor: '#1C1C1E', width: '100%', padding: 20, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
