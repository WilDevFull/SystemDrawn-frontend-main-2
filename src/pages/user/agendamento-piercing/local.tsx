import { router } from '@/lib/navigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native-web';

import { useAgendamentoPiercingStore }
from '@/store/agendamentoPiercingStore';

const locaisPiercing = [
  {
    nome: 'Orelha',
    descricao:
      'Lóbulo, hélix, tragus e mais',
  },
  {
    nome: 'Nariz',
    descricao:
      'Narina, septo e bridge',
  },
  {
    nome: 'Umbigo',
    descricao:
      'Superior, inferior ou lateral',
  },
  {
    nome: 'Sobrancelha',
    descricao:
      'Vertical, horizontal ou anti',
  },
  {
    nome: 'Lábio',
    descricao:
      'Labret, medusa, monroe e mais',
  },
];

export default function LocalPiercingScreen() {
  /**
   * Estado visual
   * da seleção.
   */
  const [
    selecionado,
    setSelecionado,
  ] = useState('');

  /**
   * Zustand do fluxo.
   */
  const setLocal =
    useAgendamentoPiercingStore(
      (state) =>
        state.setLocal
    );

  /**
   * Continua
   * para próxima etapa.
   */
  function handleContinuar() {
    /**
     * Impede continuar
     * sem selecionar.
     */
    if (!selecionado) return;

    /**
     * Salva local
     * no Zustand.
     */
    setLocal(selecionado);

    /**
     * Vai para
     * tipo piercing.
     *
     * index.tsx
     */
    router.push(
      '/agendamento-piercing'
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Piercing
      </Text>

      <Text style={styles.subtitle}>
        Escolha o local do piercing
      </Text>

      <View style={styles.progressBar}>
        <View
          style={
            styles.progressFill
          }
        />
      </View>

      <Text style={styles.step}>
        Etapa 1 de 5
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {locaisPiercing.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,

                /**
                 * Destaca
                 * item selecionado.
                 */
                selecionado ===
                  item.nome &&
                  styles.cardSelected,
              ]}
              activeOpacity={
                0.8
              }
              onPress={() =>
                setSelecionado(
                  item.nome
                )
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                {item.nome}
              </Text>

              <Text
                style={
                  styles.cardText
                }
              >
                {item.descricao}
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
        <Text style={styles.btnText}>
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({
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
      width: '20%',
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