import { router } from '@/lib/navigation';

import React, {
    useState,
} from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
    criarAgendamentoPiercing,
} from '@/services/piercing.service';

import {
    useAgendamentoPiercingStore,
} from '@/store/agendamentoPiercingStore';

import {
    useAuthStore,
} from '@/store/authstore';
import { formatCivilDate } from '@/utils/civilDate';

export default function
ResumoPiercingScreen() {

  const {
    local,
    tipoPiercing,
    tipoPiercingId,
    joia,
    joiaId,
    data,
    horario,
    observacao,
    reset,
  } =
    useAgendamentoPiercingStore();

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const dataFormatada = formatCivilDate(data);

  async function
  handleConfirmar() {

    if (loading)
      return;

    if (
      !tipoPiercingId ||
      !joiaId ||
      !data ||
      !horario
    ) {

      Alert.alert(
        'Erro',
        'Preencha todas as etapas.'
      );

      return;
    }

    if (!token) {

      Alert.alert(
        'Erro',
        'Sessão expirada. Faça login novamente.'
      );

      return;
    }

    try {

      setLoading(true);

      const payload = {
        tipo_piercing_id:
          tipoPiercingId,

        joia_piercing_id:
          joiaId,

        data,

        horario,

        observacao:
          observacao || '',
      };

      console.log(
        'PAYLOAD AGENDAMENTO:',
        payload
      );

      await criarAgendamentoPiercing(
        payload,
        token
      );

      router.push(
        '/agendamento-piercing/loading'
      );

    } catch (error: any) {

      console.log(error);

      const message =
        error?.response?.data
          ?.message;

      Alert.alert(
        'Erro',
        message ||
        'Não foi possível confirmar o agendamento.'
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Resumo do Agendamento
      </Text>

      <Text style={styles.subtitle}>
        Confira as informações
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Local
        </Text>

        <Text style={styles.value}>
          {local}
        </Text>

        <Text style={styles.label}>
          Piercing
        </Text>

        <Text style={styles.value}>
          {tipoPiercing}
        </Text>

        <Text style={styles.label}>
          Joia
        </Text>

        <Text style={styles.value}>
          {joia}
        </Text>

        <Text style={styles.label}>
          Data
        </Text>

        <Text style={styles.value}>
          {dataFormatada}
        </Text>

        <Text style={styles.label}>
          Horário
        </Text>

        <Text style={styles.value}>
          {horario}
        </Text>

      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          loading &&
          styles.btnDisabled,
        ]}
        disabled={loading}
        onPress={
          handleConfirmar
        }
      >

        {loading ? (

          <ActivityIndicator
            color="#FFF"
          />

        ) : (

          <Text
            style={
              styles.btnText
            }
          >
            Confirmar Agendamento
          </Text>

        )}

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
marginBottom: 24,
},

card: {
backgroundColor:
'#1A1A1A',
borderRadius: 20,
padding: 24,
borderWidth: 1,
borderColor:
'#2A2A2A',
},

label: {
color: '#888',
marginTop: 10,
marginBottom: 4,
},

value: {
color: '#FFF',
fontSize: 20,
fontWeight:
'bold',
marginBottom: 10,
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
marginTop: 'auto',
marginBottom: 30,
},

btnDisabled: {
opacity: 0.7,
},

btnText: {
color: '#FFF',
fontSize: 18,
fontWeight:
'bold',
},
});