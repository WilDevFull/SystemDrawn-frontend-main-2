import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';
import { router, useLocalSearchParams } from '@/lib/navigation'; // 1. Importamos hooks de rota
import { useAgendamentoTatuagemStore } from '@/store/agendamentoTatuagemStore';

const estilos = ['Preto e Branco', 'Colorida'];

export default function EstiloTattoo() {
  const { id, modo } = useLocalSearchParams(); // 3. Capturamos se estamos editando
  const { setEstilo, estilo } = useAgendamentoTatuagemStore();

  const handleContinuar = () => {
    // 5. Passamos o id e modo para a próxima tela caso necessário
    const query = modo === 'editar' ? `?id=${id}&modo=editar` : '';
    router.push(`/agendamento-tatuagem/data${query}` as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Tatuagem</Text>
      <Text style={styles.subTitle}>{modo === 'editar' ? 'Editando estilo' : 'Escolha o estilo'}</Text>
      <View style={[styles.progressBar, { width: '60%' }]} />
      <Text style={styles.stepText}>Etapa 3 de 5</Text>

      <ScrollView>
        {estilos.map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[styles.option, estilo === item && styles.selected]} 
            onPress={() => setEstilo(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={handleContinuar}>
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
