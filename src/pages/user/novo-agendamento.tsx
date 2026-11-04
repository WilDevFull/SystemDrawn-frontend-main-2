import { router } from '@/lib/navigation';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native-web';

export default function NovoAgendamentoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Agendamentos
      </Text>

      {/* Novo Piercing */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/agendamento-piercing/local')}
      >
        <Text style={styles.cardTitle}>Novo Piercing</Text>
        <Text style={styles.cardSub}>Agende sua sessão</Text>
      </TouchableOpacity>

      {/* Nova Tatuagem */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Nova Tatuagem</Text>
        <Text style={styles.cardSub}>Agende sua sessão</Text>
      </TouchableOpacity>

      {/* Meus Agendamentos (Vai para a lista) */}
      <TouchableOpacity
        style={[styles.card, styles.cardGerenciar]}
        onPress={() => router.push('/meus-agendamentos' as any)}
      >
        <Text style={styles.cardTitle}>Meus Agendamentos</Text>
        <Text style={styles.cardSub}>Visualizar, editar ou cancelar agendamentos</Text>
      </TouchableOpacity>

      {/* Cancelar / Voltar */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#1A1A1A', borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#7B2FF7' },
  cardGerenciar: { borderColor: '#444', backgroundColor: '#111' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  cardSub: { color: '#AAA', marginTop: 4 },
  cancelar: { color: '#FFF', textAlign: 'center', marginTop: 24, fontSize: 16 },
});
