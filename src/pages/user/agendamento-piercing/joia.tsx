import { router } from '@/lib/navigation';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
  buscarJoias,
} from '@/services/piercing.service';

import {
  useAgendamentoPiercingStore,
} from '@/store/agendamentoPiercingStore';

import {
  useAuthStore,
} from '@/store/authstore';

export default function
JoiaPiercingScreen() {

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  const tipoPiercingId =
    useAgendamentoPiercingStore(
      (state) =>
        state.tipoPiercingId
    );

  const setJoia =
    useAgendamentoPiercingStore(
      (state) =>
        state.setJoia
    );

  const [
    joias,
    setJoias,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selecionada,
    setSelecionada,
  ] = useState<any>(
    null
  );

  useEffect(() => {

    async function
    carregarJoias() {

      try {

        if (!token) {
          return;
        }

        setLoading(true);

        const response =
          await buscarJoias(
            token
          );

        console.log(
          'JOIAS:',
          response
        );

        const filtradas =
          response.filter(
            (item: any) =>
              item.tipo_piercing_id ===
              tipoPiercingId
          );

        console.log(
          'FILTRADAS:',
          filtradas
        );

        setJoias(
          filtradas
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          'Erro',
          'Não foi possível carregar as joias.'
        );

      } finally {

        setLoading(false);
      }
    }

    carregarJoias();

  }, []);

  function
  handleContinuar() {

    if (!selecionada)
      return;

    setJoia(
      selecionada.nome,
      selecionada.id
    );

    router.push(
      '/agendamento-piercing/data'
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
        Escolha sua Joia
      </Text>

      <Text style={styles.subtitle}>
        Selecione a joia do piercing
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {joias.map(
          (item) => (

            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,

                selecionada?.id ===
                  item.id &&
                  styles.cardSelected,
              ]}
              onPress={() =>
                setSelecionada(
                  item
                )
              }
            >

              <Text
                style={
                  styles.nome
                }
              >
                {item.nome}
              </Text>

              <Text
                style={
                  styles.info
                }
              >
                {item.material}
              </Text>

              <Text
                style={
                  styles.info
                }
              >
                Cor:
                {' '}
                {item.cor}
              </Text>

              <Text
                style={
                  styles.preco
                }
              >
                R$
                {' '}
                {item.preco}
              </Text>

            </TouchableOpacity>
          )
        )}

      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,

          !selecionada &&
          styles.buttonDisabled,
        ]}
        disabled={
          !selecionada
        }
        onPress={
          handleContinuar
        }
      >
        <Text
          style={
            styles.buttonText
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

container: {
flex: 1,
backgroundColor:
'#000',
padding: 20,
},

loadingContainer: {
flex: 1,
justifyContent:
'center',
alignItems:
'center',
backgroundColor:
'#000',
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
padding: 20,
borderRadius: 20,
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

nome: {
color: '#FFF',
fontSize: 18,
fontWeight:
'bold',
},

info: {
color: '#AAA',
marginTop: 6,
},

preco: {
color: '#A855F7',
fontWeight:
'bold',
marginTop: 12,
fontSize: 16,
},

button: {
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

buttonDisabled: {
opacity: 0.4,
},

buttonText: {
color: '#FFF',
fontSize: 18,
fontWeight:
'bold',
},
});