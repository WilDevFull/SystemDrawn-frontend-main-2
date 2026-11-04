import {
    useRef,
    useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { Alert } from '@/lib/alert';

import {
    useLocalSearchParams,
    useRouter,
} from '@/lib/navigation';

import {
    register,
} from '@/services/auth.service';

import {
    useAuthStore,
} from '@/store/authstore';

export default function CadastroScreen() {

const router =
useRouter();

const { cpf: cpfParam } =
useLocalSearchParams();

const authLogin =
useAuthStore(
(state) =>
state.login
);

const [cpf, setCpf] =
useState(
String(cpfParam || '')
);

const [
nomeCompleto,
setNomeCompleto,
] = useState('');

const [loading,
setLoading] =
useState(false);

const [captchaToken,
setCaptchaToken] =
useState<string | null>(null);

const recaptchaRef =
useRef<ReCAPTCHA>(null);

const handleCadastro =
async () => {

try {

if (
cpf.length !== 11
) {

Alert.alert(
'Erro',
'CPF deve conter exatamente 11 números.'
);

return;
}

if (
nomeCompleto
.trim()
.split(' ')
.length < 2
) {

Alert.alert(
'Erro',
'Informe nome e sobrenome.'
);

return;
}

if (
!captchaToken
) {

Alert.alert(
'Erro',
'Confirme que você não é um robô.'
);

return;
}

setLoading(true);

const response =
await register(
cpf,
nomeCompleto,
captchaToken
);

authLogin(
response.usuario,
response.token
);

router.replace('/home');

} catch (error: any) {

recaptchaRef.current?.reset();

setCaptchaToken(null);

Alert.alert(
'Erro',
error?.response
?.data
?.message
||
'Não foi possível cadastrar.'
);

} finally {

setLoading(false);
}
};

return (

<View style={styles.container}>

<View style={styles.content}>

<Text style={styles.title}>
Criar conta
</Text>

<Text style={styles.subtitle}>
Preencha seus dados
</Text>

<View style={styles.inputGroup}>

<Text style={styles.label}>
CPF
</Text>

<TextInput
style={styles.input}
keyboardType="numeric"
value={cpf}
onChangeText={setCpf}
maxLength={11}
/>

</View>

<View style={styles.inputGroup}>

<Text style={styles.label}>
Nome completo
</Text>

<TextInput
style={styles.input}
value={nomeCompleto}
onChangeText={
setNomeCompleto
}
placeholder="Ex: Maria Silva"
placeholderTextColor="#666"
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
onPress={
handleCadastro
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
Cadastrar
</Text>

)}

</TouchableOpacity>

</View>

</View>
);
}

const styles =
StyleSheet.create({
container: {
flex: 1,
backgroundColor:
'#090909',
justifyContent:
'center',
paddingHorizontal:
40,
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
fontSize: 22,
marginBottom: 40,
},

inputGroup: {
marginBottom: 25,
},

label: {
color: '#FFF',
marginBottom: 10,
},

input: {
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
marginTop: 20,
},

buttonText: {
color: '#FFF',
fontWeight:
'bold',
fontSize: 18,
},
});