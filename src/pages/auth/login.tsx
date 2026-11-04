import {
    useRef,
    useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
    useRouter,
} from '@/lib/navigation';


import {
    useAuthStore,
} from '@/store/authstore';

import {
    login as loginWithCpf,
} from '@/services/auth.service';

export default function
LoginScreen() {

  const [cpf, setCpf] =
    useState('');

  const [loading, setLoading] =
    useState(false);
  const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

  const recaptchaRef =
    useRef<ReCAPTCHA>(null);

  const router =
    useRouter();

  const authLogin =
    useAuthStore(
      (state) =>
        state.login
    );

  const handleContinuar =
    async () => {

      if (!cpf.trim()) {
        Alert.alert(
          'Erro',
          'Digite um CPF válido.'
        );
        return;
      }

      if (!captchaToken) {
        Alert.alert(
          'Erro',
          'Confirme que você não é um robô.'
        );
        return;
      }

      try {
        setLoading(true);

        const response = await loginWithCpf(cpf, captchaToken);

        authLogin(
          response.usuario,
          response.token,
          'customer'
        );

        router.replace('/home');
      } catch (error: any) {
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        Alert.alert(
          'Erro',
          error?.response?.data?.message
            || 'Não foi possível entrar.'
        );
      } finally {
        setLoading(false);
      }
    };

  return (

    <KeyboardAvoidingView
      style={
        styles.container
      }
      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : 'height'
      }
    >

      <TouchableWithoutFeedback
        onPress={
          Platform.OS === 'web'
            ? undefined
            : Keyboard.dismiss
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >

          <View
            style={
              styles.content
            }
          >

            <Text
              style={
                styles.title
              }
            >
              Olá, bem-vindo!
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Insira seu CPF
              para prosseguirmos
            </Text>

            <View
              style={
                styles.inputGroup
              }
            >

              <Text
                style={
                  styles.label
                }
              >
                CPF
              </Text>

              <TextInput
                style={
                  styles.input
                }
                keyboardType="numeric"
                value={cpf}
                onChangeText={
                  setCpf
                }
                maxLength={11}
                placeholder="Digite seu CPF"
                placeholderTextColor="#666"
                returnKeyType="done"
              />

            </View>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="dark"
              hl="pt-BR"
              onChange={setCaptchaToken}
            />

            <TouchableOpacity
              style={
                styles.button
              }
              onPress={
                handleContinuar
              }
              disabled={loading || !captchaToken}
            >

              {loading ? (

                <ActivityIndicator
                  color="#FFF"
                />

              ) : (

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Continuar
                </Text>

              )}

            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.registerButton
              }
              onPress={() =>
                router.push(
                  '/cadastro'
                )
              }
            >

              <Text
                style={
                  styles.registerText
                }
              >
                Não possui conta?
                {' '}
                Cadastre-se
              </Text>

            </TouchableOpacity>

            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => router.push('/admin-login')}
              >
                <Text style={styles.adminButtonText}>
                  Entrar como Admin
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </ScrollView>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}

const styles =
StyleSheet.create({

container: {
flex: 1,
backgroundColor:
'#090909',
},

scrollContent: {
flexGrow: 1,
justifyContent:
'center',
paddingHorizontal:
40,
paddingBottom: 40,
},

content: {
width: '100%',
},

title: {
color: '#FFF',
fontSize: 34,
fontWeight:
'bold',
marginBottom: 20,
},

subtitle: {
color: '#FFF',
lineHeight: 28,
fontSize: 22,
marginBottom: 40,
},

inputGroup: {
marginBottom: 35,
},

label: {
color: '#FFF',
marginBottom: 10,
fontSize: 16,
},

input: {
width: '100%',
height: 55,
backgroundColor:
'#231F2A',
borderRadius: 14,
paddingHorizontal: 20,
color: '#FFF',
fontSize: 18,
},

button: {
width: 180,
height: 55,
backgroundColor:
'#231F2A',
borderRadius: 14,
justifyContent:
'center',
alignItems:
'center',
alignSelf:
'center',
marginTop: 10,
borderWidth: 1,
borderColor:
'#333',
},

buttonText: {
color: '#DDD',
fontWeight:
'bold',
fontSize: 18,
},

registerButton: {
marginTop: 25,
alignItems:
'center',
},

registerText: {
color: '#999',
fontSize: 15,
},

adminButton: {
  marginTop: 18,
  alignItems: 'center',
  alignSelf: 'center',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#444',
  backgroundColor: '#17151B',
},

adminButtonText: {
  color: '#FFF',
  fontSize: 14,
  fontWeight: '600',
},
});