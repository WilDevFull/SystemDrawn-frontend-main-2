import { useAuthStore } from '@/store/authstore';
import { MaterialCommunityIcons } from '@/components/icons';
import { useRouter } from '@/lib/navigation';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native-web';

export default function Configuracoes() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  
  // Nossos Estados
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fonteGrande, setFonteGrande] = useState(false);
  
  // Estado para controlar se a caixinha de excluir conta aparece ou não
  const [modalVisivel, setModalVisivel] = useState(false);
  
  // Estado do Idioma
  const [idioma, setIdioma] = useState('pt'); 

  const idiomasDisponiveis = ['pt', 'en', 'es', 'fr'];

  const mudarIdioma = () => {
    const indexAtual = idiomasDisponiveis.indexOf(idioma);
    const proximoIndex = (indexAtual + 1) % idiomasDisponiveis.length;
    setIdioma(idiomasDisponiveis[proximoIndex]);
  };

  const colors = {
    background: isDarkMode ? '#0A0A0A' : '#F4F4F5', 
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',       
    textPrimary: isDarkMode ? '#FFFFFF' : '#18181B', 
    textSecondary: isDarkMode ? '#A1A1AA' : '#71717A', 
    icon: isDarkMode ? '#E4E4E7' : '#52525B',        
  };

  const tamanhoTextoPrincipal = fonteGrande ? 20 : 16;
  const tamanhoTextoSecundario = fonteGrande ? 14 : 12;

  const dicionario = {
    pt: {
      titulo: 'Configurações',
      subTitulo: 'Gerencie as preferências da sua conta',
      secaoConta: 'Conta',
      dadosPessoais: 'Dados Pessoais',
      notificacoes: 'Notificações',
      secaoAcessibilidade: 'Acessibilidade e Aparência',
      tema: 'Tema do Aplicativo',
      temaDesc: isDarkMode ? 'Modo Escuro ativado' : 'Modo Claro ativado',
      tamanhoFonte: 'Texto Maior',
      tamanhoFonteDesc: 'Aumentar o tamanho das letras',
      idiomaTitulo: 'Idioma: Português',
      idiomaDesc: 'Toque para mudar o idioma',
      secaoAcoes: 'Ações',
      sair: 'Sair da Conta',
      alertaSair: 'Saindo do app...',
      excluirConta: 'Excluir Conta',
      alertaExcluirTitulo: 'Atenção',
      alertaExcluirMsg: 'Confirmar exclusão da sua conta?',
      cancelar: 'Não',
      confirmarExclusao: 'Sim'
    },
    en: {
      titulo: 'Settings',
      subTitulo: 'Manage your account preferences',
      secaoConta: 'Account',
      dadosPessoais: 'Personal Information',
      notificacoes: 'Notifications',
      secaoAcessibilidade: 'Accessibility & Appearance',
      tema: 'App Theme',
      temaDesc: isDarkMode ? 'Dark Mode enabled' : 'Light Mode enabled',
      tamanhoFonte: 'Larger Text',
      tamanhoFonteDesc: 'Increase the font size',
      idiomaTitulo: 'Language: English',
      idiomaDesc: 'Tap to change language',
      secaoAcoes: 'Actions',
      sair: 'Log Out',
      alertaSair: 'Logging out...',
      excluirConta: 'Delete Account',
      alertaExcluirTitulo: 'Warning',
      alertaExcluirMsg: 'Confirm account deletion?',
      cancelar: 'No',
      confirmarExclusao: 'Yes'
    },
    es: {
      titulo: 'Configuraciones',
      subTitulo: 'Administra las preferencias de tu cuenta',
      secaoConta: 'Cuenta',
      dadosPessoais: 'Datos Personales',
      notificacoes: 'Notificaciones',
      secaoAcessibilidade: 'Accesibilidad y Apariencia',
      tema: 'Tema de la Aplicación',
      temaDesc: isDarkMode ? 'Modo Oscuro activado' : 'Modo Claro activado',
      tamanhoFonte: 'Texto Más Grande',
      tamanhoFonteDesc: 'Aumentar el tamaño de la letra',
      idiomaTitulo: 'Idioma: Español',
      idiomaDesc: 'Toca para cambiar el idioma',
      secaoAcoes: 'Acciones',
      sair: 'Cerrar Sesión',
      alertaSair: 'Saliendo de la app...',
      excluirConta: 'Eliminar Cuenta',
      alertaExcluirTitulo: 'Atención',
      alertaExcluirMsg: '¿Confirmar eliminación de tu cuenta?',
      cancelar: 'No',
      confirmarExclusao: 'Sí'
    },
    fr: {
      titulo: 'Paramètres',
      subTitulo: 'Gérez les préférences de votre compte',
      secaoConta: 'Compte',
      dadosPessoais: 'Données Personnelles',
      notificacoes: 'Notifications',
      secaoAcessibilidade: 'Accessibilité et Apparence',
      tema: 'Thème de l\'App',
      temaDesc: isDarkMode ? 'Mode Sombre activé' : 'Mode Clair activé',
      tamanhoFonte: 'Texte Plus Grand',
      tamanhoFonteDesc: 'Augmenter la taille de la police',
      idiomaTitulo: 'Langue: Français',
      idiomaDesc: 'Appuyez pour changer de langue',
      secaoAcoes: 'Actions',
      sair: 'Se Déconnecter',
      alertaSair: 'Déconnexion...',
      excluirConta: 'Supprimer le Compte',
      alertaExcluirTitulo: 'Attention',
      alertaExcluirMsg: 'Confirmer la suppression de votre compte?',
      cancelar: 'Non',
      confirmarExclusao: 'Oui'
    }
  };

  const t = dicionario[idioma as keyof typeof dicionario];

  // Lógica quando o usuário confirma a exclusão
  const handleConfirmarExclusao = () => {
    setModalVisivel(false);
    logout();
    router.replace('/login');
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleIrParaPerfil = () => {
    router.push('/perfil');
  };

  const handleIrParaNotificacoes = () => {
    router.push('/notificacoes');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fonteGrande ? 34 : 28 }]}>
              {t.titulo}
            </Text>
          </View>
          
          <Text style={[styles.subTitle, { color: colors.textSecondary, fontSize: tamanhoTextoSecundario }]}>
            {t.subTitulo}
          </Text>

          {/* ================= CATEGORIA: CONTA ================= */}
          <Text style={[styles.sectionTitle, { fontSize: fonteGrande ? 15 : 13 }]}>{t.secaoConta}</Text>
          
<TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} onPress={handleIrParaPerfil}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="account-outline" size={24} color={colors.icon} />
              <Text style={[styles.optionText, { color: colors.textPrimary, fontSize: tamanhoTextoPrincipal }]}>
                {t.dadosPessoais}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#52525B" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} onPress={handleIrParaNotificacoes}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={colors.icon} />
              <Text style={[styles.optionText, { color: colors.textPrimary, fontSize: tamanhoTextoPrincipal }]}>
                {t.notificacoes}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#52525B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.card, borderColor: '#FF453A' }]}
            onPress={handleLogout}
          >
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="logout" size={24} color="#FF453A" />
              <Text style={[styles.optionText, { color: '#FF453A', fontSize: tamanhoTextoPrincipal }]}>
                {t.sair}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FF453A" />
          </TouchableOpacity>

          {/* ================= CATEGORIA: ACESSIBILIDADE ================= */}
          <Text style={[styles.sectionTitle, { fontSize: fonteGrande ? 15 : 13 }]}>{t.secaoAcessibilidade}</Text>

          <View style={[styles.optionRow, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name={isDarkMode ? "weather-night" : "white-balance-sunny"} size={24} color={colors.icon} />
              <View>
                <Text style={[styles.optionText, { color: colors.textPrimary, fontSize: tamanhoTextoPrincipal }]}>
                  {t.tema}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary, fontSize: tamanhoTextoSecundario }]}>
                  {t.temaDesc}
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D4D4D8', true: '#3F3F46' }}
              thumbColor={'#FFFFFF'}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
              value={isDarkMode}
            />
          </View>

          <View style={[styles.optionRow, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="format-font-size-increase" size={24} color={fonteGrande ? '#3B82F6' : colors.icon} />
              <View>
                <Text style={[styles.optionText, { color: colors.textPrimary, fontSize: tamanhoTextoPrincipal }]}>
                  {t.tamanhoFonte}
                </Text>
                <Text style={[styles.optionDescription, { color: fonteGrande ? '#3B82F6' : colors.textSecondary, fontSize: tamanhoTextoSecundario }]}>
                  {t.tamanhoFonteDesc}
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D4D4D8', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
              onValueChange={() => setFonteGrande(!fonteGrande)}
              value={fonteGrande}
            />
          </View>

          <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} onPress={mudarIdioma}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="translate" size={24} color={'#10B981'} />
              <View>
                <Text style={[styles.optionText, { color: colors.textPrimary, fontSize: tamanhoTextoPrincipal }]}>
                  {t.idiomaTitulo}
                </Text>
                <Text style={[styles.optionDescription, { color: '#10B981', fontSize: tamanhoTextoSecundario }]}>
                  {t.idiomaDesc}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="sync" size={24} color="#10B981" />
          </TouchableOpacity>

          {/* ================= CATEGORIA: AÇÕES ================= */}
          <Text style={[styles.sectionTitle, { fontSize: fonteGrande ? 15 : 13 }]}>{t.secaoAcoes}</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
            <Text style={[styles.logoutText, { fontSize: tamanhoTextoPrincipal }]}>{t.sair}</Text>
          </TouchableOpacity>

          {/* Ao clicar, abrimos o nosso Modal customizado */}
          <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisivel(true)}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#EF4444" />
            <Text style={[styles.logoutText, { fontSize: tamanhoTextoPrincipal }]}>{t.excluirConta}</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* ================= MODAL DE CONFIRMAÇÃO ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#EF4444" style={{ marginBottom: 15 }} />
            
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t.alertaExcluirTitulo}</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>{t.alertaExcluirMsg}</Text>
            
            <View style={styles.modalButtonsRow}>
              {/* Botão NÃO */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.buttonCancel]} 
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.buttonCancelText}>{t.cancelar}</Text>
              </TouchableOpacity>
              
              {/* Botão SIM */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.buttonConfirm]} 
                onPress={handleConfirmarExclusao}
              >
                <Text style={styles.buttonConfirmText}>{t.confirmarExclusao}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4, 
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  subTitle: {
    marginBottom: 30,
    marginLeft: 44, 
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#71717A',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    fontWeight: '500',
  },
  optionDescription: {
    marginLeft: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1010', 
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A1010',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  logoutText: {
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  
  // Estilos do Modal (Caixinha de Confirmação)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escuro transparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: '#3F3F46', // Cinza escuro para não chamar tanta atenção
    marginRight: 10,
  },
  buttonConfirm: {
    backgroundColor: '#EF4444', // Vermelho para a ação de perigo
    marginLeft: 10,
  },
  buttonCancelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonConfirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});