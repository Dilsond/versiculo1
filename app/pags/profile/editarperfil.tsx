import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchWithToken } from '@/app/api';  // Supondo que a função fetchWithToken está localizada aqui
import Config from '@/app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: number;
  nome: string;
  email: string;
  numero_telefone: string;
  endereco: string;
  status: string;
  foto: string;
  data_de_registro: Date;
}

const EditarUser = () => {
  const navigation = useNavigation();
  const baseUrl = Config.getApiUrl();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const asyncData = await AsyncStorage.getItem('userData');
  //     if (asyncData) {
  //       const userData = JSON.parse(asyncData);
  //       setUserData(userData);
  //       setName(userData.nome);
  //       setBio(userData.status);  // Atualize o campo de bio de acordo com a estrutura de dados do seu API
  //       if (userData.foto) {
  //         setProfileImage(`${baseUrl}${userData.foto}`);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    if (userData) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetchWithToken(`${baseUrl}api/usuario/${userData.id}/`);
          const dados = await response.json();
          setName(dados.nome);
          setBio(dados.status);  // Atualize o campo de bio de acordo com a estrutura de dados do seu API
          setProfileImage(dados.foto  ? `${baseUrl}${dados.foto}` : null);
          setLoading(false);
        } catch (err) {
          setError("Erro ao carregar os detalhes do usuário");
          setLoading(false);
        }
      };

      fetchUserDetails();
    }
  }, [userData, baseUrl]);

  const handleSave = async () => {
    if (!name || !bio) {
      Alert.alert('Campos obrigatórios', 'Nome e biografia não podem estar vazios');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nome', name);
      formData.append('bio', bio);

      if (profileImage) {
        const uri = profileImage;
        const name = uri.split('/').pop();
        const type = `image/${name.split('.').pop()}`;
        const file = {
          uri,
          name,
          type,
        };
        formData.append('foto', file);
      }

      const response = await fetchWithToken(`${baseUrl}api/usuario/${userData?.id}/atualizar/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
        setName(updatedUserData.nome);
        setBio(updatedUserData.status); 
        // setProfileImage (null); 
        setProfileImage(updatedUserData.foto ? `${baseUrl}${updatedUserData.foto}` : null);
        console.log("okokokokokokok");
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        navigation.goBack();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao salvar os dados.");
      }
    } catch (error) {
      setError("Erro ao salvar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = async () => {
    // Permissão da galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
      return;
    }

    // Selecionando uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelectImage} style={styles.imageContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg')}
          style={styles.profileImage}
        />
        <Text style={styles.changeImageText}>Alterar Foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Biografia:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={bio}
        onChangeText={setBio}
        multiline={true}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { marginTop: 5, fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  textArea: { height: 100, textAlignVertical: 'top', marginBottom: 380 },
  saveButton: { backgroundColor: 'black', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  imageContainer: { alignItems: 'center', marginBottom: 20, marginTop: 5 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: 'black' },
  changeImageText: { marginTop: 10, color: 'black', fontSize: 14, fontWeight: 'bold' },
});

export default EditarUser;
