import React from 'react';

import { router } from '@/lib/navigation';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';

import {
    useAgendamentoPiercingStore,
} from '@/store/agendamentoPiercingStore';
import { formatCivilDate } from '@/utils/civilDate';

export default function
SucessoPiercingScreen() {

  const {
    local,
    tipoPiercing,
    joia,
    data,
    horario,
    reset,
  } =
    useAgendamentoPiercingStore();

  const dataFormatada = formatCivilDate(data);

  function
  handleVoltarHome() {

    reset();

    router.push('/home');
  }

  function
  handleHistorico() {

    reset();

    router.push(
      '/meus-agendamentos'
    );
  }

  return (

    <View
      style={
        styles.container
      }
    >

      <View
        style={
          styles.iconContainer
        }
      >
        <Text
          style={
            styles.check
          }
        >
          ✓
        </Text>
      </View>

      <Text
        style={
          styles.title
        }
      >
        Agendamento Confirmado
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Seu piercing foi agendado
        com sucesso.
      </Text>

      <View
        style={
          styles.infoCard
        }
      >

        <Text
          style={
            styles.infoLabel
          }
        >
          Piercing
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {local}
          {' - '}
          {tipoPiercing}
        </Text>

        <Text
          style={
            styles.infoLabel
          }
        >
          Joia
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {joia}
        </Text>

        <Text
          style={
            styles.infoLabel
          }
        >
          Data
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {dataFormatada}
        </Text>

        <Text
          style={
            styles.infoLabel
          }
        >
          Horário
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {horario}
        </Text>

      </View>

      <TouchableOpacity
        style={
          styles.primaryButton
        }
        onPress={
          handleVoltarHome
        }
      >

        <Text
          style={
            styles.primaryText
          }
        >
          Voltar para Home
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={
          styles.secondaryButton
        }
        onPress={
          handleHistorico
        }
      >

        <Text
          style={
            styles.secondaryText
          }
        >
          Ver meus agendamentos
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
padding: 24,
justifyContent:
'center',
},

iconContainer: {
width: 120,
height: 120,
borderRadius: 60,
backgroundColor:
'#1A1A1A',
borderWidth: 2,
borderColor:
'#A855F7',
justifyContent:
'center',
alignItems:
'center',
alignSelf:
'center',
},

check: {
color: '#A855F7',
fontSize: 55,
fontWeight:
'bold',
},

title: {
color: '#FFF',
fontSize: 30,
fontWeight:
'bold',
textAlign:
'center',
marginTop: 30,
},

subtitle: {
color: '#888',
fontSize: 16,
textAlign:
'center',
marginTop: 10,
marginBottom: 30,
},

infoCard: {
backgroundColor:
'#1A1A1A',
borderRadius: 24,
padding: 24,
borderWidth: 1,
borderColor:
'#2A2A2A',
marginBottom: 35,
},

infoLabel: {
color: '#888',
marginBottom: 4,
},

infoValue: {
color: '#FFF',
fontSize: 20,
fontWeight:
'bold',
marginBottom: 18,
},

primaryButton: {
backgroundColor:
'#A855F7',
height: 60,
borderRadius: 18,
justifyContent:
'center',
alignItems:
'center',
marginBottom: 14,
},

primaryText: {
color: '#FFF',
fontSize: 18,
fontWeight:
'bold',
},

secondaryButton: {
borderWidth: 1,
borderColor:
'#333',
height: 60,
borderRadius: 18,
justifyContent:
'center',
alignItems:
'center',
},

secondaryText: {
color: '#FFF',
fontSize: 16,
fontWeight:
'600',
},
});