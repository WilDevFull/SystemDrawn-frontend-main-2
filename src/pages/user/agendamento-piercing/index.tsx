import { router } from '@/lib/navigation';
import React, {
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
    buscarTiposPiercing,
} from '@/services/piercing.service';

import {
    useAuthStore,
} from '@/store/authstore';

import {
    useAgendamentoPiercingStore,
} from '@/store/agendamentoPiercingStore';

export default function TipoPiercingScreen() {

  const token =
    useAuthStore(
      (state) => state.token
    );

  const local =
    useAgendamentoPiercingStore(
      (state) => state.local
    );

  const setTipoPiercing =
    useAgendamentoPiercingStore(
      (state) =>
        state.setTipoPiercing
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    tiposPiercing,
    setTiposPiercing,
  ] = useState<any[]>([]);

  const [
    selecionado,
    setSelecionado,
  ] = useState<any>(null);

  useEffect(() => {

    async function carregarTipos() {

      try {

        if (!token) {
          setTiposPiercing([]);
          setLoading(false);
          return;
        }

        const tipos =
          await buscarTiposPiercing(
            token
          );

        const filtrados =
          tipos.filter(
            (
              item: any
            ) =>
              item.local
                ?.toLowerCase()
                .trim() ===
              local
                ?.toLowerCase()
                .trim()
          );

        console.log(
          'TIPOS FILTRADOS:',
          filtrados
        );

        setTiposPiercing(
          filtrados
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          'Erro',
          'Não foi possível carregar os tipos de piercing.'
        );

      } finally {

        setLoading(false);
      }
    }

    carregarTipos();

  }, [local, token]);

  function handleContinuar() {

    if (!selecionado)
      return;

    /**
     * LOG IMPORTANTE
     */
    console.log(
      'PIERCING SELECIONADO:',
      selecionado
    );

    setTipoPiercing(
      selecionado.sub_local,
      selecionado.id
    );

    router.push(
      '/agendamento-piercing/joia'
    );
  }

  if (loading) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#A855F7"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Piercing - {local}
      </Text>

      <Text style={styles.subtitle}>
        Escolha a posição específica
      </Text>

      <View style={styles.progressBar}>
        <View
          style={
            styles.progressFill
          }
        />
      </View>

      <Text style={styles.step}>
        Etapa 2 de 5
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {tiposPiercing.map(
          (item) => (

            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,

                selecionado?.id ===
                  item.id &&
                  styles.cardSelected,
              ]}
              onPress={() =>
                setSelecionado(
                  item
                )
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                {item.sub_local}
              </Text>

              <Text
                style={
                  styles.cardText
                }
              >
                Tempo de cicatrização:
                {' '}
                {
                  item.tempo_cicatrizacao
                }
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.btn,

          !selecionado &&
            styles.btnDisabled,
        ]}
        disabled={
          !selecionado
        }
        onPress={
          handleContinuar
        }
      >
        <Text
          style={
            styles.btnText
          }
        >
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({

    loadingContainer: {
      flex: 1,
      backgroundColor:
        '#000',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    container: {
      flex: 1,
      backgroundColor:
        '#000',
      padding: 20,
    },

    title: {
      color: '#FFF',
      fontSize: 30,
      fontWeight:
        'bold',
      marginTop: 30,
    },

    subtitle: {
      color: '#AAA',
      marginBottom: 20,
    },

    progressBar: {
      height: 6,
      backgroundColor:
        '#222',
      borderRadius: 10,
      marginBottom: 10,
    },

    progressFill: {
      width: '40%',
      height: '100%',
      backgroundColor:
        '#A855F7',
      borderRadius: 10,
    },

    step: {
      color: '#A855F7',
      marginBottom: 20,
    },

    card: {
      backgroundColor:
        '#1A1A1A',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor:
        '#2A2A2A',
    },

    cardSelected: {
      borderColor:
        '#A855F7',
      backgroundColor:
        '#24112F',
    },

    cardTitle: {
      color: '#FFF',
      fontSize: 22,
      fontWeight:
        'bold',
      marginBottom: 6,
    },

    cardText: {
      color: '#AAA',
      fontSize: 14,
    },

    btn: {
      backgroundColor:
        '#A855F7',
      height: 60,
      borderRadius: 18,
      justifyContent:
        'center',
      alignItems:
        'center',
      marginTop: 10,
      marginBottom: 20,
    },

    btnDisabled: {
      opacity: 0.4,
    },

    btnText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight:
        'bold',
    },
  });