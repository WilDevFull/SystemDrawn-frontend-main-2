import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
  router,
} from '@/lib/navigation';

import {
  MaterialCommunityIcons,
} from '@/components/icons';

import {
  useAuthStore,
} from '@/store/authstore';

import {
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  removerNotificacao,
} from '@/services/notificacao.service';

export default function
NotificacoesScreen() {

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
    notificacoes,
    setNotificacoes,
  ] = useState<any[]>([]);

  async function
  carregarNotificacoes() {

    try {

      if (!token)
        return;

      const response =
        await listarNotificacoes(
          token
        );

      setNotificacoes(
        response
      );

    } catch (
      error
    ) {

      console.log(
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar notificações.'
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function
  handleMarcarLida(
    id: string
  ) {

    try {

      await marcarComoLida(
        id,
        token!
      );

      carregarNotificacoes();

    } catch (
      error
    ) {

      Alert.alert(
        'Erro',
        'Não foi possível marcar como lida.'
      );
    }
  }

  async function
  handleMarcarTodas() {

    try {

      await marcarTodasComoLidas(
        token!
      );

      carregarNotificacoes();

      Alert.alert(
        'Sucesso',
        'Todas as notificações foram marcadas como lidas.'
      );

    } catch (
      error
    ) {

      Alert.alert(
        'Erro',
        'Não foi possível atualizar.'
      );
    }
  }

  async function
  handleRemover(
    id: string
  ) {

    Alert.alert(
      'Excluir notificação',
      'Deseja remover esta notificação?',
      [
        {
          text:
            'Cancelar',
          style:
            'cancel',
        },

        {
          text:
            'Excluir',

          style:
            'destructive',

          onPress:
            async () => {

            try {

              await removerNotificacao(
                id,
                token!
              );

              carregarNotificacoes();

            } catch (
              error
            ) {

              Alert.alert(
                'Erro',
                'Não foi possível remover.'
              );
            }
          },
        },
      ]
    );
  }

function formatarData(data: string) {
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: 'America/Recife',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
          onPress={() =>
            router.back()
          }
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
          Notificações
        </Text>

      </View>

      {/* BOTÃO */}
      {notificacoes.length >
        0 && (

        <TouchableOpacity
          style={
            styles.markAllButton
          }
          onPress={
            handleMarcarTodas
          }
        >

          <Text
            style={
              styles.markAllText
            }
          >
            Marcar todas como lidas
          </Text>

        </TouchableOpacity>
      )}

      {/* LOADING */}
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

      ) : notificacoes.length ===
        0 ? (

        <View
          style={
            styles.emptyContainer
          }
        >

          <MaterialCommunityIcons
            name="bell-off-outline"
            size={80}
            color="#555"
          />

          <Text
            style={
              styles.emptyTitle
            }
          >
            Sem notificações
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Quando houver novidades
            sobre seus agendamentos,
            elas aparecerão aqui.
          </Text>

        </View>

      ) : (

        <FlatList
          data={
            notificacoes
          }
          keyExtractor={(
            item: (typeof notificacoes)[number]
          ) =>
            item.id
          }
          renderItem={({
            item,
          }: { item: (typeof notificacoes)[number] }) => (

            <TouchableOpacity
              activeOpacity={
                0.8
              }
              style={[
                styles.card,

                !item.lida &&
                  styles.unreadCard,
              ]}
              onPress={() =>
                handleMarcarLida(
                  item.id
                )
              }
            >

              <View
                style={
                  styles.cardHeader
                }
              >

                <View
                  style={
                    styles.titleRow
                  }
                >

                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={22}
                    color="#A855F7"
                  />

                  <Text
                    style={
                      styles.cardTitle
                    }
                  >
                    {
                      item.titulo
                    }
                  </Text>

                </View>

                <TouchableOpacity
                  onPress={() =>
                    handleRemover(
                      item.id
                    )
                  }
                >

                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={24}
                    color="#EF4444"
                  />

                </TouchableOpacity>

              </View>

              <Text
                style={
                  styles.message
                }
              >
                {
                  item.mensagem
                }
              </Text>

              <Text
                style={
                  styles.date
                }
              >
                {
                  formatarData(
                    item.created_at
                  )
                }
              </Text>

              {!item.lida && (

                <View
                  style={
                    styles.badge
                  }
                />
              )}

            </TouchableOpacity>
          )}
        />
      )}

    </View>
  );
}

const styles =
StyleSheet.create({

container: {
flex: 1,
backgroundColor:
'#0A0A0A',
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
fontSize: 28,
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

markAllButton: {
alignSelf:
'flex-end',
marginBottom:
20,
},

markAllText: {
color:
'#A855F7',
fontWeight:
'bold',
},

card: {
backgroundColor:
'#1A1A1A',
borderRadius:
20,
padding: 20,
marginBottom:
15,
borderWidth: 1,
borderColor:
'#333',
},

unreadCard: {
borderColor:
'#A855F7',
},

cardHeader: {
flexDirection:
'row',
justifyContent:
'space-between',
alignItems:
'center',
marginBottom:
12,
},

titleRow: {
flexDirection:
'row',
alignItems:
'center',
gap: 10,
flex: 1,
},

cardTitle: {
color: '#FFF',
fontSize: 17,
fontWeight:
'bold',
},

message: {
color: '#CCC',
fontSize: 14,
lineHeight:
22,
marginBottom:
10,
},

date: {
color: '#666',
fontSize: 12,
},

badge: {
width: 10,
height: 10,
borderRadius: 5,
backgroundColor:
'#A855F7',
position:
'absolute',
top: 15,
right: 15,
},

emptyContainer: {
flex: 1,
justifyContent:
'center',
alignItems:
'center',
paddingHorizontal:
30,
},

emptyTitle: {
color: '#FFF',
fontSize: 22,
fontWeight:
'bold',
marginTop: 20,
},

emptyText: {
color: '#777',
fontSize: 15,
textAlign:
'center',
marginTop: 10,
lineHeight:
24,
},
});
