import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EditarUser = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Délcio Paiva');
  const [bio, setBio] = useState('Vamos ser felizes!');
  const [profileImage, setProfileImage] = useState(null); 

  const handleSave = () => {
    console.log('Informações atualizadas:', { name, bio, profileImage });
    navigation.goBack();
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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5'},
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