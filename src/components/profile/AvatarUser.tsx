import { Image, StyleSheet, Text, View } from 'react-native-web';

interface AvatarProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export function AvatarUser({ name, email, imageUrl }: AvatarProps) {
  // Imagem padrão caso o usuário ainda não tenha foto
  const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUrl || defaultImage }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333333', // Borda escura combinando com o tema
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto principal em branco
  },
  email: {
    fontSize: 14,
    color: '#A1A1AA', // E-mail em cinza claro
    marginTop: 4,
  },
});