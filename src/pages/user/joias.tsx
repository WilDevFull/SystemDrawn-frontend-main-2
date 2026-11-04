import { buscarJoias } from '@/services/piercing.service';
import { useAuthStore } from '@/store/authstore';
import { useRouter } from '@/lib/navigation';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';

type Joia = {
  id: string | number;
  nome: string;
  material?: string;
  cor?: string;
  preco?: string | number;
};

export default function JoiasScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [joias, setJoias] = useState<Joia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function carregarJoias() {
      if (!token) {
        setJoias([]);
        setError('Sua sessão expirou. Entre novamente para consultar as joias.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await buscarJoias(token);
        if (active) setJoias(Array.isArray(response) ? response : []);
      } catch {
        if (active) setError('Não foi possível carregar o catálogo de joias.');
      } finally {
        if (active) setLoading(false);
      }
    }

    carregarJoias();
    return () => {
      active = false;
    };
  }, [token, reloadKey]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Catálogo</Text>
        <Text style={styles.title}>Joias para piercing</Text>
        <Text style={styles.description}>Peças cadastradas para os agendamentos disponíveis.</Text>

        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color="#C084FC" />
            <Text style={styles.stateText}>Carregando joias</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>Não foi possível carregar</Text>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setReloadKey((key) => key + 1)}>
              <Text style={styles.secondaryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : joias.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>Nenhuma joia disponível</Text>
            <Text style={styles.stateText}>O catálogo não retornou peças para exibição.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {joias.map((joia) => (
              <article key={joia.id} style={styles.card}>
                <Text style={styles.cardEyebrow}>Piercing</Text>
                <Text style={styles.cardTitle}>{joia.nome}</Text>
                {joia.material ? <Text style={styles.cardText}>{joia.material}</Text> : null}
                {joia.cor ? <Text style={styles.cardText}>Cor: {joia.cor}</Text> : null}
                {joia.preco !== undefined && joia.preco !== null ? (
                  <Text style={styles.price}>R$ {joia.preco}</Text>
                ) : null}
              </article>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/agendamento-piercing/local')}>
          <Text style={styles.buttonText}>Agendar piercing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: '#09090B',
  },
  content: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    padding: 24,
  },
  eyebrow: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Georgia',
    fontSize: 38,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    color: '#AAA6B0',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    width: '48%',
    minWidth: 250,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#302E35',
    borderTopColor: '#A855F7',
    borderTopWidth: 2,
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#111114',
  },
  cardEyebrow: {
    color: '#A5A1AD',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardText: {
    color: '#BDB8C4',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  price: {
    color: '#D8B4FE',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
  },
  state: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderColor: '#302E35',
    padding: 24,
  },
  stateTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    color: '#AAA6B0',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 22,
    marginTop: 28,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4C4654',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
