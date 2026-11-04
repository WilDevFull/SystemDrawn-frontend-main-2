import React, {
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';

import {
  router,
} from '@/lib/navigation';

export default function
LoadingAgendamentoScreen() {

  useEffect(() => {

    const timer =
      setTimeout(() => {

        router.replace(
          '/agendamento-piercing/sucesso'
        );

      }, 2500);

    return () =>
      clearTimeout(
        timer
      );

  }, []);

  return (

    <View
      style={
        styles.container
      }
    >

      <View
        style={
          styles.iconCircle
        }
      >

        <Text
          style={
            styles.icon
          }
        >
          ✦
        </Text>

      </View>

      <Text
        style={
          styles.title
        }
      >
        Confirmando seu
        agendamento
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Estamos preparando
        tudo para sua sessão
      </Text>

      <ActivityIndicator
        size="large"
        color="#A855F7"
      />

      <Text
        style={
          styles.smallText
        }
      >
        Isso leva apenas
        alguns segundos...
      </Text>

    </View>
  );
}

const styles =
StyleSheet.create({

container: {
flex: 1,
backgroundColor:
'#000',
justifyContent:
'center',
alignItems:
'center',
padding:
30,
},

iconCircle: {
width:
120,
height:
120,
borderRadius:
60,
backgroundColor:
'#1A1A1A',
borderWidth:
2,
borderColor:
'#A855F7',
justifyContent:
'center',
alignItems:
'center',
marginBottom:
35,
},

icon: {
fontSize:
50,
color:
'#A855F7',
},

title: {
color:
'#FFF',
fontSize:
28,
fontWeight:
'bold',
textAlign:
'center',
marginBottom:
12,
},

subtitle: {
color:
'#AAA',
fontSize:
16,
textAlign:
'center',
marginBottom:
35,
lineHeight:
24,
},

smallText: {
marginTop:
20,
color:
'#777',
fontSize:
14,
},
});