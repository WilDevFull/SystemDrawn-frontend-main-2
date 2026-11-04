import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';
import { router } from '@/lib/navigation';
import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';

const tamanhos = ['Pequena (até 5cm)', 'Média (até 15cm)', 'Grande (acima de 15cm)'];

export default function TamanhoTattoo() {
  const { setTamanho, tamanho } = useAgendamentoTatuagemStore();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Tatuagem</Text>
      <Text style={styles.subTitle}>Escolha o tamanho</Text>
      
      {/* Barra de Progresso */}
      <View style={[styles.progressBar, { width: '60%' }]} />
      <Text style={styles.stepText}>Etapa 2 de 5</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tamanhos.map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[styles.option, tamanho === item && styles.selected]} 
            onPress={() => setTamanho(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push('/agendamento-tatuagem/estilo' as any)}
      >
        <Text style={styles.btnText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subTitle: { color: '#888', marginBottom: 20 },
  progressBar: { height: 4, backgroundColor: '#7B2FF7', marginBottom: 8 },
  stepText: { color: '#7B2FF7', marginBottom: 20 },
  option: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  selected: { borderColor: '#7B2FF7', backgroundColor: '#262629' },
  optionText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  btn: { backgroundColor: '#7B2FF7', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});