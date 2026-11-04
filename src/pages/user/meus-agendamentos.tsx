import { router } from '@/lib/navigation';

import {
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import DateTimePicker from '@/components/DateTimePicker';

import {
    MaterialCommunityIcons,
} from '@/components/icons';

import {
    cancelarAgendamentoPiercing,
    editarAgendamentoPiercing,
    listarAgendamentosPiercing,
} from '@/services/piercing.service';

import {
    useAuthStore,
} from '@/store/authstore';
import {
    formatCivilDate,
    formatLocalDate,
    toCivilDateString,
} from '@/utils/civilDate';

export default function
MeusAgendamentosScreen() {

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    agendamentos,
    setAgendamentos,
  ] = useState<any[]>([]);

  /**
   * Modal
   */
  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  const [
    agendamentoSelecionado,
    setAgendamentoSelecionado,
  ] = useState<string | null>(
    null
  );

  const [
    dataSelecionada,
    setDataSelecionada,
  ] = useState(
    new Date()
  );

  const [
    mostrarCalendario,
    setMostrarCalendario,
  ] = useState(false);

  const [
    horarioSelecionado,
    setHorarioSelecionado,
  ] = useState('');

  const horarios =
    [
      '09:00',
      '10:00',
      '11:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

  async function
  carregarAgendamentos() {

    try {

      if (!token)
        return;

      const response =
        await listarAgendamentosPiercing(
          token
        );

      setAgendamentos(
        response.agendamentos ||
        []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  /**
   * CANCELAR
   */
  async function
  handleCancelar(
    id: string
  ) {

    Alert.alert(
      'Cancelar Agendamento',
      'Deseja realmente cancelar?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },

        {
          text: 'Sim',

          onPress:
            async () => {

            try {

              await cancelarAgendamentoPiercing(
                id,
                token!
              );

              Alert.alert(
                'Sucesso',
                'Agendamento cancelado.'
              );

              carregarAgendamentos();

            } catch (
              error: any
            ) {

              Alert.alert(
                'Erro',
                error?.response
                  ?.data
                  ?.message
                  ||
                'Não foi possível cancelar.'
              );
            }
          },
        },
      ]
    );
  }

  /**
   * ABRIR MODAL
   */
  function
  abrirModalReagendar(
    id: string
  ) {

    setAgendamentoSelecionado(
      id
    );

    setHorarioSelecionado('');

    setDataSelecionada(
      new Date()
    );

    setModalVisible(
      true
    );
  }

  /**
   * CONFIRMAR
   */
  async function
  confirmarReagendamento() {

    try {

      if (
        !horarioSelecionado
      ) {

        Alert.alert(
          'Erro',
          'Selecione um horário.'
        );

        return;
      }

      await editarAgendamentoPiercing(
        agendamentoSelecionado!,
        {
          data: toCivilDateString(dataSelecionada),

          horario:
            `${horarioSelecionado}:00`,
        },
        token!
      );

      Alert.alert(
        'Sucesso',
        'Agendamento reagendado.'
      );

      setModalVisible(
        false
      );

      carregarAgendamentos();

    } catch (
      error: any
    ) {

      console.log(
        error?.response
      );

      Alert.alert(
        'Erro',
        error?.response
          ?.data
          ?.message
          ||
        'Não foi possível reagendar.'
      );
    }
  }

  return (

    <View
      style={
        styles.container
      }
    >

      {/* HEADER */}
      <View
        style={
          styles.header
        }
      >

        <TouchableOpacity
          onPress={() => router.push('/home')}
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="#FFF"
          />

        </TouchableOpacity>

        <Text
          style={
            styles.title
          }
        >
          Meus Agendamentos
        </Text>

      </View>

      {loading ? (

        <View
          style={
            styles.center
          }
        >

          <ActivityIndicator
            size="large"
            color="#A855F7"
          />

        </View>

      ) : (

        <ScrollView>

          {agendamentos.map(
            (item) => (

              <View
                key={
                  item.id
                }
                style={
                  styles.card
                }
              >

                <Text
                  style={
                    styles.info
                  }
                >
                  Data:
                  {' '}
                  {formatCivilDate(item.data)}
                </Text>

                <Text
                  style={
                    styles.info
                  }
                >
                  Horário:
                  {' '}
                  {
                    item.horario?.slice(
                      0,
                      5
                    )
                  }
                </Text>

                <View
                  style={
                    styles.actions
                  }
                >

                  <TouchableOpacity
                    style={
                      styles.btnEditar
                    }
                    onPress={() =>
                      abrirModalReagendar(
                        item.id
                      )
                    }
                  >

                    <Text
                      style={
                        styles.btnText
                      }
                    >
                      Reagendar
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.btnCancelar
                    }
                    onPress={() =>
                      handleCancelar(
                        item.id
                      )
                    }
                  >

                    <Text
                      style={
                        styles.btnText
                      }
                    >
                      Cancelar
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>
            )
          )}

        </ScrollView>
      )}

      {/* MODAL */}
      <Modal
        visible={
          modalVisible
        }
        transparent
        animationType="slide"
      >

        <View
          style={
            styles.overlay
          }
        >

          <View
            style={
              styles.modal
            }
          >

            <Text
              style={
                styles.modalTitle
              }
            >
              Reagendar
            </Text>

            <TouchableOpacity
              style={
                styles.dateBtn
              }
              onPress={() =>
                setMostrarCalendario(
                  true
                )
              }
            >

              <Text
                style={
                  styles.dateText
                }
              >
                {formatLocalDate(dataSelecionada)}
              </Text>

            </TouchableOpacity>

            {mostrarCalendario && (

              <DateTimePicker
                value={
                  dataSelecionada
                }
                mode="date"
                minimumDate={
                  new Date()
                }
                onChange={(
                  event,
                  selectedDate
                ) => {

                  setMostrarCalendario(
                    false
                  );

                  if (
                    selectedDate
                  ) {

                    setDataSelecionada(
                      selectedDate
                    );
                  }
                }}
              />
            )}

            <View
              style={
                styles.horarios
              }
            >

              {horarios.map(
                (
                  hora
                ) => (

                  <TouchableOpacity
                    key={hora}
                    style={[
                      styles.horarioBtn,

                      horarioSelecionado ===
                        hora &&
                        styles.horarioSelecionado,
                    ]}
                    onPress={() =>
                      setHorarioSelecionado(
                        hora
                      )
                    }
                  >

                    <Text
                      style={
                        styles.btnText
                      }
                    >
                      {hora}
                    </Text>

                  </TouchableOpacity>
                )
              )}

            </View>

            <TouchableOpacity
              style={
                styles.confirmBtn
              }
              onPress={
                confirmarReagendamento
              }
            >

              <Text
                style={
                  styles.btnText
                }
              >
                Confirmar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

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
},

header: {
flexDirection:
'row',
alignItems:
'center',
gap: 15,
marginTop: 20,
marginBottom: 25,
},

title: {
color: '#FFF',
fontSize: 26,
fontWeight:
'bold',
},

center: {
flex: 1,
justifyContent:
'center',
alignItems:
'center',
},

card: {
backgroundColor:
'#1A1A1A',
padding: 20,
borderRadius: 20,
marginBottom: 20,
},

info: {
color: '#FFF',
marginBottom: 8,
fontSize: 16,
},

actions: {
flexDirection:
'row',
gap: 10,
marginTop: 20,
},

btnEditar: {
flex: 1,
backgroundColor:
'#A855F7',
height: 50,
borderRadius: 14,
justifyContent:
'center',
alignItems:
'center',
},

btnCancelar: {
flex: 1,
backgroundColor:
'#C0392B',
height: 50,
borderRadius: 14,
justifyContent:
'center',
alignItems:
'center',
},

btnText: {
color: '#FFF',
fontWeight:
'bold',
},

overlay: {
flex: 1,
justifyContent:
'center',
backgroundColor:
'rgba(0,0,0,0.7)',
padding: 20,
},

modal: {
backgroundColor:
'#111',
borderRadius: 24,
padding: 20,
},

modalTitle: {
color: '#FFF',
fontSize: 24,
fontWeight:
'bold',
marginBottom: 20,
},

dateBtn: {
backgroundColor:
'#1C1C1E',
padding: 18,
borderRadius: 14,
},

dateText: {
color: '#FFF',
},

horarios: {
flexDirection:
'row',
flexWrap:
'wrap',
gap: 10,
marginTop: 20,
},

horarioBtn: {
backgroundColor:
'#1C1C1E',
padding: 14,
borderRadius:
12,
},

horarioSelecionado: {
backgroundColor:
'#A855F7',
},

confirmBtn: {
backgroundColor:
'#A855F7',
height: 55,
borderRadius:
16,
justifyContent:
'center',
alignItems:
'center',
marginTop: 30,
},
});

