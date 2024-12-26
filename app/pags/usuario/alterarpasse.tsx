import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Config from '../Config';

const VerificationScreen = () => {
  const [loading, setLoading] = React.useState(false);
  
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const baseUrl = Config.getApiUrl(); 
  
    
  
    
  
    
  
    const handleSenhaRecover = async () => {
      setLoading(true);
       
      try {
        const response = await fetch(`${baseUrl}api/password-reset/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Email enviado com sucesso!');
          
          
          navigation.replace("Login");
        } else {
          Alert.alert('Erro ao enviar o email', data.detail || 'Nenhum user encontrado com este email');
        }
      } catch (error) {
        console.error('Erro ao enviar o email:', error);
        Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
      } finally {
        setLoading(false);
      }
    };


    return (
        <LinearGradient colors={['#2e5764', '#73909a', '#2e5764']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
            {/* <Image source={require('')} style={styles.logoImage}/> */}
            <Text style={styles.text}>Enter your email to receive the verification code</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o seu email..."
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                
            />
            <TouchableOpacity style={styles.button} onPress={handleSenhaRecover} disabled={loading}>
                <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    // logoImage: {
    //     width: 200,
    //     height: 120,
    //     marginBottom: 90,
    //     marginTop: 80,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   },
      text: {
        marginTop: 60,
        marginBottom: 120,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
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
        marginBottom: 20
      },
      button: {
        marginTop: 20,
        padding: 15,
        width: 200, borderWidth: 2,
        borderColor: '#333',
        borderRadius: 17,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 56,
        marginRight: 'auto',
      },
});

export default VerificationScreen;