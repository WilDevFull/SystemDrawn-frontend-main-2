import { router } from '@/lib/navigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native-web';

import { useAgendamentoPiercingStore }
from '@/store/agendamentoPiercingStore';

const horariosDisponiveis = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export default function HorarioPiercingScreen() {
  /**
   * Estado visual do horário selecionado.
   */
  const [
    horarioSelecionado,
    setHorarioSelecionado,
  ] = useState('');

  /**
   * Salva horário globalmente.
   *
   * Será usado:
   * - resumo
   * - backend
   * - histórico
   */
  const setHorario =
    useAgendamentoPiercingStore(
      (state) => state.setHorario
    );

  function handleContinue() {
    /**
     * Não deixa continuar sem horário.
     */
    if (!horarioSelecionado) return;

    /**
     * Salva no Zustand.
     */
    setHorario(
      horarioSelecionado
    );

    /**
     * Vai para resumo.
     */
    router.push(
      '/agendamento-piercing/resumo'
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Horário
      </Text>

      <Text style={styles.subtitle}>
        Escolha o horário disponível
      </Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.step}>
        Etapa 5 de 5
      </Text>

      <View style={styles.grid}>
        {horariosDisponiveis.map(
          (horario) => (
            <TouchableOpacity
              key={horario}
              style={[
                styles.card,

                /**
                 * Destaca horário selecionado
                 */
                horarioSelecionado ===
                  horario &&
                  styles.cardSelected,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setHorarioSelecionado(
                  horario
                )
              }
            >
              <Text
                style={[
                  styles.cardText,

                  horarioSelecionado ===
                    horario &&
                    styles.cardTextSelected,
                ]}
              >
                {horario}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          !horarioSelecionado &&
            styles.btnDisabled,
        ]}
        disabled={
          !horarioSelecionado
        }
        onPress={handleContinue}
      >
        <Text style={styles.btnText}>
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },

  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
  },

  subtitle: {
    color: '#AAA',
    marginBottom: 20,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 10,
  },

  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor:
      '#A855F7',
    borderRadius: 10,
  },

  step: {
    color: '#A855F7',
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },

  card: {
    width: '47%',
    backgroundColor:
      '#1A1A1A',
    borderRadius: 20,
    height: 80,
    justifyContent:
      'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      '#2A2A2A',
  },

  /**
   * Card selecionado
   */
  cardSelected: {
    backgroundColor:
      '#A855F7',
    borderColor: '#FFF',
    borderWidth: 2,
  },

  cardText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  /**
   * Texto selecionado
   */
  cardTextSelected: {
    color: '#FFF',
  },

  btn: {
    backgroundColor:
      '#A855F7',
    height: 60,
    borderRadius: 18,
    justifyContent:
      'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },

  btnDisabled: {
    opacity: 0.4,
  },

  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});