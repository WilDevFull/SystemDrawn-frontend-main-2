import { useAuthStore } from '@/store/authstore';
import { useRouter } from '@/lib/navigation';
import { loginAdmin } from '@/services/auth.service';
import { useRef, useState } from 'react';
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

export default function AdminLoginScreen() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);
  const loginAsAdmin = useAuthStore((state) => state.loginAsAdmin);

  const handleEntrar = async () => {
    if (!cpf.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Informe o CPF e a senha do administrador.');
      return;
    }

    if (!captchaToken) {
      Alert.alert('Erro', 'Confirme que você não é um robô.');
      return;
    }

    try {
      setLoading(true);

      const response = await loginAdmin(cpf, senha, captchaToken);

      loginAsAdmin(response.usuario, response.token);
      router.replace('/admin');
    } catch (error: any) {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      Alert.alert(
        'Erro',
        error?.response?.data?.message || 'Não foi possível entrar como administrador.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Login de Admin</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                placeholder="Digite seu CPF"
                placeholderTextColor="#666"
                maxLength={11}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                placeholderTextColor="#666"
                secureTextEntry
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
              style={styles.button}
              onPress={handleEntrar}
              disabled={loading || !captchaToken}
            >
              {loading ? (
                <ActivityIndicator color="#DDD" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
  },
  headerRow: {
    width: '100%',
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
  },
  backText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    color: '#FFF',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#231F2A',
    borderRadius: 14,
    paddingHorizontal: 20,
    color: '#FFF',
    fontSize: 18,
  },
  button: {
    width: 180,
    height: 55,
    backgroundColor: '#231F2A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: '#DDD',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
