import { useRouter } from '@/lib/navigation';

import {
    useState,
} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
    IconButton,
} from '@/components/ui';

import {
    AvatarUser,
} from '@/components/profile/AvatarUser';

import {
    useAuthStore,
} from '@/store/authstore';

export default function
Perfil() {

  const router =
    useRouter();

  /**
   * Usuário logado.
   */
  const user =
    useAuthStore(
      (state) =>
        state.user
    );

  /**
   * Logout store.
   */
  const logout =
    useAuthStore(
      (state) =>
        state.logout
    );

  /**
   * Nome real backend.
   */
  const nomeUsuario =
    user?.nomeCompleto
    || 'Usuário';

  /**
   * CPF backend.
   */
  const cpfUsuario =
    user?.cpf
    || 'CPF não encontrado';

  /**
   * Primeiro nome.
   */
  const primeiroNome =
    nomeUsuario
      .split(' ')[0];

  /**
   * Menu item.
   */
  const MenuOption = ({
    icon,
    title,
    isDestructive = false,
    rota,
    mensagemAlerta,
  }: {
    icon: string;
    title: string;
    isDestructive?: boolean;
    rota?: string;
    mensagemAlerta?: string;
  }) => {

    const [
      isExpanded,
      setIsExpanded,
    ] = useState(false);

    return (

      <View>

        <TouchableOpacity
          style={
            styles.menuItem
          }
          activeOpacity={
            0.7
          }
          onPress={() => {

            /**
             * Navegação.
             */
            if (rota) {

              router.push(
                rota as any
              );

              return;
            }

            /**
             * Expandir.
             */
            if (
              mensagemAlerta
            ) {

              setIsExpanded(
                !isExpanded
              );

              return;
            }

            /**
             * Logout.
             */
            if (
              isDestructive
            ) {

              Alert.alert(
                'Sair da conta',
                'Deseja realmente sair?',
                [
                  {
                    text:
                      'Cancelar',
                    style:
                      'cancel',
                  },

                  {
                    text:
                      'Sair',

                    style:
                      'destructive',

                    onPress:
                      () => {
                        logout();
                        router.replace('/login');
                      },
                  },
                ]
              );
            }
          }}
        >

          <View
            style={
              styles.menuItemLeft
            }
          >

            <IconButton
              icon={icon}
              iconColor={
                isDestructive
                  ? '#FF453A'
                  : '#A1A1AA'
              }
              size={24}
              style={{
                margin: 0,
                padding: 0,
              }}
            />

            <Text
              style={[
                styles.menuItemText,

                isDestructive &&
                  {
                    color:
                      '#FF453A',
                  },
              ]}
            >
              {title}
            </Text>

          </View>

          <IconButton
            icon={
              mensagemAlerta &&
              isExpanded
                ? 'chevron-down'
                : 'chevron-right'
            }
            iconColor="#555"
            size={24}
            style={{
              margin: 0,
              padding: 0,
            }}
          />

        </TouchableOpacity>

        {isExpanded &&
          mensagemAlerta && (

          <View
            style={
              styles.expandedContent
            }
          >

            <Text
              style={
                styles.expandedText
              }
            >
              {
                mensagemAlerta
              }
            </Text>

          </View>
        )}

      </View>
    );
  };

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        <TouchableOpacity
          style={
            styles.backHomeButton
          }
          onPress={() => router.push('/home')}
        >

          <IconButton
            icon="arrow-left"
            iconColor="#FFFFFF"
            size={20}
            style={{
              margin: 0,
              padding: 0,
            }}
          />

          <Text
            style={
              styles.backHomeText
            }
          >
            Voltar para
            Início
          </Text>

        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Meu Perfil
        </Text>

        {/* CARD USUÁRIO */}
        <View
          style={
            styles.avatarCard
          }
        >

          <AvatarUser
            name={
              primeiroNome
            }
            email={
              cpfUsuario
            }
          />

          <View
            style={{
              marginTop: 15,
            }}
          >

            <Text
              style={{
                color:
                  '#FFF',
                fontSize:
                  22,
                fontWeight:
                  'bold',
              }}
            >
              {nomeUsuario}
            </Text>

            <Text
              style={{
                color:
                  '#999',
                marginTop:
                  6,
              }}
            >
              CPF:
              {' '}
              {cpfUsuario}
            </Text>

          </View>

        </View>

        {/* ATIVIDADES */}
        <View
          style={
            styles.section
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Minhas
            Atividades
          </Text>

          <View
            style={
              styles.cardGroup
            }
          >

            <MenuOption
              icon="calendar"
              title="Próximos Agendamentos"
              rota="/meus-agendamentos"
            />

            <View
              style={
                styles.divider
              }
            />

            <MenuOption
              icon="history"
              title="Histórico de Tatuagens"
              mensagemAlerta="Histórico ainda em desenvolvimento."
            />

            <View
              style={
                styles.divider
              }
            />

            <MenuOption
              icon="diamond-outline"
              title="Histórico de Piercings"
              mensagemAlerta="Histórico ainda em desenvolvimento."
            />

          </View>

        </View>

        {/* CONTA */}
        <View
          style={
            styles.section
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Conta
          </Text>

          <View
            style={
              styles.cardGroup
            }
          >

            <MenuOption
              icon="cog-outline"
              title="Configurações"
              rota="/configuracoes"
            />

            <View
              style={
                styles.divider
              }
            />

            <MenuOption
              icon="logout"
              title="Sair da Conta"
              isDestructive
            />

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles =
StyleSheet.create({
container: {
flex: 1,
backgroundColor:
'#0A0A0A',
},

scrollContent: {
paddingHorizontal:
20,
paddingTop: 40,
paddingBottom: 60,
},

backHomeButton: {
flexDirection:
'row',
alignItems:
'center',
marginBottom:
20,
backgroundColor:
'#1C1C1E',
padding: 10,
borderRadius:
12,
alignSelf:
'flex-start',
borderWidth: 1,
borderColor:
'#333333',
},

backHomeText: {
color: '#FFFFFF',
marginLeft: 5,
fontWeight:
'600',
marginRight:
10,
},

headerTitle: {
fontSize: 28,
fontWeight:
'bold',
color:
'#FFFFFF',
marginBottom:
20,
},

avatarCard: {
backgroundColor:
'#1C1C1E',
borderRadius:
16,
marginBottom:
30,
padding: 20,
borderWidth: 1,
borderColor:
'#333333',
},

section: {
marginBottom:
25,
},

sectionTitle: {
fontSize: 14,
fontWeight:
'600',
color:
'#A1A1AA',
marginBottom:
10,
textTransform:
'uppercase',
letterSpacing:
1,
},

cardGroup: {
backgroundColor:
'#1C1C1E',
borderRadius:
16,
borderWidth: 1,
borderColor:
'#333333',
overflow:
'hidden',
},

menuItem: {
flexDirection:
'row',
alignItems:
'center',
justifyContent:
'space-between',
paddingVertical:
12,
paddingHorizontal:
15,
},

menuItemLeft: {
flexDirection:
'row',
alignItems:
'center',
},

menuItemText: {
fontSize: 16,
color:
'#FFFFFF',
marginLeft:
10,
fontWeight:
'500',
},

divider: {
height: 1,
backgroundColor:
'#333333',
marginLeft:
50,
},

expandedContent: {
backgroundColor:
'#242426',
paddingHorizontal:
15,
paddingBottom:
15,
paddingTop: 5,
paddingLeft:
50,
},

expandedText: {
color:
'#A1A1AA',
fontSize: 14,
lineHeight:
20,
},
});