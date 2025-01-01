import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
// import { View } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../Config';
import jwt_decode, { jwtDecode } from 'jwt-decode';


interface UserData {
  nome: string;
  email: string;
  numero_telefone: string;
  endereco: string;
  status: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());
  const baseUrl = Config.getApiUrl();
  const { control } = useForm();
  const { formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');

        if (storedUserData) {
          navigation.replace("HomeScreen");
        }
      } catch (error) {
        console.error('Erro ao recuperar dados:', error);

      }
    };

    fetchUserData(); 
  }, []);



  const resetInactivityTimer = () => {
    setLastActiveTime(Date.now());
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
        const response = await fetch(`${baseUrl}api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const decodedToken = jwtDecode(data.access);
            console.log("Token decodificado:", decodedToken);
            
            if (decodedToken.is_usuario) {
                setToken(data.access);
                setIsLoggedIn(true);

                await AsyncStorage.setItem('accessToken', data.access);
                await AsyncStorage.setItem('refreshToken', data.refresh);

                fetchUserData(data.access);
                navigation.navigate("HomeScreen");
            } else {
                Alert.alert('Erro', 'Usuário não autorizado.');
                navigation.navigate('LoginScreen');
            }
        } else {
            Alert.alert('Credenciais Inválidas', data.detail || 'Insira os dados corretamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
        setLoading(false);
    }
};


  const fetchUserData = async (token: string) => {
    const maxRetries = 5;
    let attempts = 0;
    let success = false;
    let userData = null;

    while (attempts < maxRetries && !success) {
      try {
        const response = await fetch(`${baseUrl}api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          userData = data;
          success = true;
        } else {
          throw new Error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        attempts += 1;
        console.error(`Tentativa ${attempts} falhou:`, error);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    if (success) {
      setUserData(userData as UserData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } else {
      Alert.alert('Erro ao buscar dados', 'Não foi possível buscar os dados do usuário após várias tentativas.');
    }
  };
  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={require('../../../assets/images/DD.png')} style={styles.logoImage} />
          <Text style={styles.text}>Faça login na sua conta</Text>

          <Text style={styles.user}>Username</Text>
          <Controller
            control={control}
            name="email"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.inputuser}
                placeholder="eg. Dilsond"
                placeholderTextColor="#888"
                onBlur={onBlur}
                onChangeText={(text) => setUsername(text)} 
                editable={!loading}
              />
            )}
          />

          <Text style={styles.pass}>Palavra-Passe</Text>
          <Controller
            control={control}
            name="password"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.inputpass}
                placeholder="***********"
                placeholderTextColor="#888"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={(text) => setPassword(text)} 
                value={password}
                editable={!loading}
              />
            )}
          />

          <TouchableOpacity>
            <Text style={styles.forgot} onPress={() => navigation.navigate('AlterarPasse')}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" /> 
            ) : (
              <Text style={styles.buttonText}>Login     »</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUp}
            onPress={() => navigation.navigate('SignUpScreen')}
          >
            <Text style={styles.signUpText}>Não tem uma conta?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9e9e9e'
  },
  logoImage: {
    width: 180,
    height: 110,
    marginBottom: 70,
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 110,
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  user: {
    color: 'black',
    marginLeft: 40,
  },
  inputuser: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    color: '#9e9e9e',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  pass: {
    color: 'black',
    marginLeft: 40,
  },
  inputpass: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    color: '#9e9e9e',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  forgot: {
    color: 'black',
    fontSize: 13,
    textAlign: 'right',
    marginRight: 40,
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    padding: 15,
    width: 200,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 17,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  signUp: {
    marginTop: 110,
  },
  signUpText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LoginScreen;
