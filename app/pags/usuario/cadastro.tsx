import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config';
import { validateEmail, validatePassword, validatePhone, handleDateInput } from './verif';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();
  const baseUrl = Config.getApiUrl();
  const [loading, setLoading] = React.useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {

        Alert.alert('Você já está logado!');
        navigation.navigate("Home");
      }
    };
    checkIfLoggedIn();
  }, [navigation]);

  const handleSignUp = async () => {
    setLoading(true);

    const formData = new FormData();

    formData.append('nome', `${firstName} ${lastName}`);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('numero_telefone', phone);
    formData.append('endereco', address);
    formData.append('dob', dob);
    formData.append('status', 'ativo');

    if (profileImage) {
      formData.append('foto', {
        uri: profileImage,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    } else {
      console.log('Nenhuma imagem selecionada.');
    }

    try {
      const response = await fetch(`${baseUrl}api/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Alert.alert("Sucesso", "Usuário criado com sucesso!");


        navigation.replace("Login");
      } else {
        Alert.alert("Erro", data.detail || "Erro desconhecido.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao criar o usuário.");
      console.error("Erro:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login realizado com sucesso!');
        await AsyncStorage.setItem('token', data.access);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        navigation.replace("Home");
      } else {
        Alert.alert('Erro ao fazer login', data.detail || 'Verifique suas credenciais');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Acesso à galeria necessário!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    } else {
      console.log('Seleção de imagem cancelada');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#2e5764', '#73909a', '#2e5764']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
        <Text style={styles.logo}>Sign Up Account</Text>
        <Text style={styles.text}>Enter your personal data to create your account</Text>

        <Text style={styles.acima}>Primeiro Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="eg. Délcio"
          placeholderTextColor="#fff8"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.acima}>Último Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="eg. Domingos"
          placeholderTextColor="#fff8"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.acima}>Email</Text>
        
            <TextInput
              style={[styles.input, errors.email && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="eg. dilsond@gmail.com"
              placeholderTextColor="#fff8"
              keyboardType="email-address"
              
              onChangeText={setEmail}
              editable={!loading}
            />
         
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Text style={styles.acima}>Senha</Text>
        <Controller
          control={control}
          name="password"
          rules={{ validate: validatePassword }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.password && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="**********"
              placeholderTextColor="#fff8"
              secureTextEntry
              value={value}
              onChangeText={setPassword}
              editable={!loading}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Text style={styles.acima}>Número de Telefone</Text>
        <Controller
          control={control}
          name="phone"
          rules={{ validate: validatePhone }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.phone && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="eg. 926 364 622"
              placeholderTextColor="#fff8"
              keyboardType="numeric"
              maxLength={9}
              value={value}
              onChangeText={setPhone}
              editable={!loading}
            />
          )}
        />

        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        <Text style={styles.acima}>Morada</Text>
        <TextInput
          style={styles.input}
          placeholder="eg. Travessas"
          placeholderTextColor="#fff8"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.acima}>Data de Nascimento</Text>
        {/* <Controller
          control={control}
          name="birthDate" */}
          
          
            <TextInput
              style={[styles.input, errors.birthDate && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="YYYY→MM→DD"
              placeholderTextColor="#fff8"
              
              
              onChangeText={setDob}
              editable={!loading}
            />
          {/* )}
        /> */}
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate.message}</Text>}

        <Text style={styles.acima}>Foto de Perfil</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleImagePick}
        >
          <Text style={styles.buttonText}>{profileImage ? "Imagem Selecionada" : "Selecionar Imagem"}</Text>
        </TouchableOpacity>

        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.imagePreview} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}   disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Continue     »</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  logo: {
    fontSize: 30,
    color: 'white',
    fontWeight: '700',
    marginTop: 60,
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'white',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#2e5764',
    color: 'white',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  acima: {
    color: 'white',
    marginLeft: 40,
  },
  button: {
    marginTop: 20,
    padding: 15,
    width: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 17,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 53,
    marginRight: 'auto',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default SignUpScreen; 