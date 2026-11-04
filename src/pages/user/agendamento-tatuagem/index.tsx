import { router } from '@/lib/navigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native-web';

import { useAgendamentoTatuagemStore }
  from '@/store/agendamentoTatuagemStore';

/**
 * Tamanhos disponíveis.
 *
 * BACKEND:
 * Depois trocar por:
 * GET /tatuagens/tamanhos
 */
const tamanhosTatuagem = [
  {
    nome: 'Micro',
    descricao:
      'Até 5cm — perfeita para detalhes delicados',
  },
  {
    nome: 'Pequena',
    descricao:
      '5cm a 10cm — ideal para pulso e tornozelo',
  },
  {
    nome: 'Média',
    descricao:
      '10cm a 20cm — ótima para braço e perna',
  },
  {
    nome: 'Grande',
    descricao:
      '20cm a 30cm — cobertura ampla de área',
  },
  {
    nome: 'Extra Grande',
    descricao:
      'Acima de 30cm — manga ou costas completas',
  },
];

export default function TamanhoTatuagemScreen() {
  /**
   * Recupera estilo
   * escolhido na etapa 1.
   */
  const estilo =
    useAgendamentoTatuagemStore(
      (state) => state.estilo
    );

  /**
   * Salva tamanho globalmente.
   */
  const setTamanho =
    useAgendamentoTatuagemStore(
      (state) => state.setTamanho
    );

  const [
    selecionado,
    setSelecionado,
  ] = useState('');

  function handleContinuar() {
    if (!selecionado) return;

    setTamanho(selecionado);

    /**
     * Vai para local do corpo.
     */
    router.push(
      '/agendamento-tatuagem/local'
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tatuagem — {estilo}
      </Text>

      <Text style={styles.subtitle}>
        Escolha o tamanho da tatuagem
      </Text>

      <View style={styles.progressBar}>
        <View
          style={styles.progressFill}
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
        {tamanhosTatuagem.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,

                selecionado ===
                  item.nome &&
                  styles.cardSelected,
              ]}
              onPress={() =>
                setSelecionado(
                  item.nome
                )
              }
            >
              <Text
                style={styles.cardTitle}
              >
                {item.nome}
              </Text>

              <Text
                style={styles.cardText}
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
        disabled={!selecionado}
        onPress={handleContinuar}
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
    width: '40%',
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 10,
  },

  step: {
    color: '#A855F7',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  cardSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#24112F',
  },

  cardTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  cardText: {
    color: '#AAA',
    fontSize: 14,
  },

  btn: {
    backgroundColor: '#A855F7',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
