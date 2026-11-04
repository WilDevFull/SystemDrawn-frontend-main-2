import {
    useEffect,
} from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native-web';

import {
    router,
} from '@/lib/navigation';

import {
    useAuthStore,
} from '@/store/authstore';

export default function
SplashScreen() {

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  useEffect(() => {

    const timer =
      setTimeout(() => {

        /**
         * Se logado
         * vai home.
         */
        if (token) {

          router.replace('/home');

          return;
        }

        /**
         * Sem login.
         */
        router.replace(
          '/login'
        );

      }, 1800);

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
          styles.logoContainer
        }
      >

        <Text
          style={
            styles.logo
          }
        >
          SystemDrawn
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Arte • Tattoo • Piercing
        </Text>

      </View>

      <ActivityIndicator
        size="large"
        color="#A855F7"
      />

      <Text
        style={
          styles.loading
        }
      >
        Carregando sua
        experiência...
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
padding: 30,
},

logoContainer: {
alignItems:
'center',
marginBottom: 60,
},

logo: {
fontSize: 38,
fontWeight:
'bold',
color:
'#A855F7',
},

subtitle: {
color:
'#999',
fontSize: 16,
marginTop: 8,
},

loading: {
marginTop: 25,
color:
'#AAA',
fontSize: 15,
},
});