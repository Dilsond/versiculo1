import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config';
import { fetchWithToken } from '../api'; 

const Profile = () => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const baseUrl = Config.getApiUrl(); 
  const basewsUrl=Config.getApiUrlWs()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  const logoutDevice = async () => {
    const token= await AsyncStorage.getItem('accessTokenFirebase');
    try {
      const response = await fetchWithToken(`${baseUrl}api/dispositivo-status/atualizar/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 
        },
        body: JSON.stringify({
          token:token,
          usuario_id: userData?.id,  
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Sucesso: Dispositivo deslogado com sucesso
        console.log('Sucesso', data.detail);
      } else {
        // Erro: Mensagem de erro recebida da API
        console.log('Erro', data.detail || 'Ocorreu um erro ao tentar deslogar o dispositivo');
      }
    } catch (error) {
      // Erro de conexão ou outro erro inesperado
      console.error('Erro ao enviar a requisição:', error);
      console.log('Erro', 'Erro de conexão. Tente novamente mais tarde.');
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const asyncdata = await AsyncStorage.getItem('userData');
      if (asyncdata) {
        const userData = JSON.parse(asyncdata);
        setUserData(userData);
      }
    };
    fetchUserData();

  }, []);
  
  const handleLogout = async () => {

    const token = await AsyncStorage.getItem('refreshToken');
    console.log(token);
    // Opcional: Notifica o backend para invalidar o token
    // if (token) {
    //   await fetchWithToken(`${baseUrl}api/logout/`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    // }
    
    await AsyncStorage.removeItem('token');
    // mandarProdutoApi();
     logoutDevice();
    await AsyncStorage.removeItem('userData');
    navigation.replace("Login");
    
    
  };

  const themeStyles = isDarkMode ? lightTheme : darkTheme;

  return (
    <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
      <LinearGradient
        colors={isDarkMode ? ['#f5f5f5', '#ffffff'] : ['#121212', '#1e1e1e']}
        style={[styles.gradient, themeStyles.gradient]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-u-left-top" size={24} color={themeStyles.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.title, themeStyles.title]}>Perfil</Text>
          <TouchableOpacity onPress={toggleTheme}>
            <MaterialCommunityIcons name="brightness-6" size={24} color={themeStyles.iconColor} />
          </TouchableOpacity>
        </View>

        {/* Card Perfil */}
        <View style={[styles.profileCard, themeStyles.profileCard]}>
          <Image
            source={require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg')}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={[styles.name, themeStyles.textColor]}>Délcio Paiva</Text>
            <Text style={[styles.email, themeStyles.subTextColor]}>domingoscadetez66@gmail.com</Text>
            <Text style={[styles.biografia, themeStyles.subTextColor]}>
              '9jahaweehwfgbefg fieaiçgEF fgnnbbgfgd 💋🙌
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, themeStyles.textColor]}>Configurações</Text>
          <SettingItem 
            icon="account-edit" 
            label="Editar Informações" 
            themeStyles={themeStyles} 
            onPress={() => navigation.navigate('EditarUser')} 
          />
          <SettingItem 
            icon="account-key" 
            label="Alterar Senha" 
            themeStyles={themeStyles} 
            onPress={() => navigation.navigate('AlterarPasse')} 
          />
          <SettingItem 
            icon="swap-horizontal" 
            label="Transferência Rápida" 
            themeStyles={themeStyles} 
            onPress={() => navigation.navigate('RegistroProdutoMobile')} 
          />
          <SettingItem 
            icon="bell-outline" 
            label="Lances" 
            themeStyles={themeStyles} 
            onPress={() => navigation.navigate('LancesUsuario')} 
          />
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.logoutButton} activeOpacity={0.8}>
          <LinearGradient
            colors={['#00b894', '#73ae90']}
            style={styles.logoutButtonGradient}
          >
            <Text style={styles.logoutButtonText}>Terminar Sessão</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Modal de Confirmação */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, themeStyles.modalContainer]}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#00b894" />
              ) : (
                <>
                  <Text style={[styles.modalTitle, themeStyles.textColor]}>Terminar Sessão</Text>
                  <Text style={[styles.modalMessage, themeStyles.subTextColor]}>
                    Tem certeza que deseja terminar a sessão?
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={handleLogout} 
                    >
                      <Text style={styles.modalButtonText}>Terminar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ScrollView>
  );
};

const SettingItem = ({ icon, label, themeStyles, onPress }) => {
  return (
    <TouchableOpacity style={[styles.settingItem, themeStyles.settingItem]} onPress={onPress}>
      <View style={[styles.settingIconContainer, themeStyles.iconContainer]}>
        <MaterialCommunityIcons name={icon} size={20} color={themeStyles.iconColor} />
      </View>
      <Text style={[styles.settingText, themeStyles.textColor]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={themeStyles.iconColor} />
    </TouchableOpacity>
  );
}
const darkTheme = {
  container: { backgroundColor: '#121212' },
  modalContainer: { backgroundColor: '#1e1e1e' },
  textColor: { color: 'white' },
  title: { color: 'white' },
  subTextColor: { color: '#aaa' },
  iconColor: 'white',
  gradient: {},
  profileCard: {
    backgroundColor: '#1e1e1e',
  },
  
};

const lightTheme = {
  container: { backgroundColor: '#f5f5f5' },
  modalContainer: { backgroundColor: '#ffffff' },
  textColor: { color: '#121212' },
  subTextColor: { color: '#555' },

  gradient: {},
  profileCard: {
    backgroundColor: '#ffffff',
  },
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, marginTop: 25 },
  gradient: { flex: 1, paddingVertical: 20, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 75},
  title: { fontSize: 18, fontWeight: 'bold' },
  profileCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    paddingTop: 60, 
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00b894',
    position: 'absolute',
    top: -50,   
  },
  infoContainer: { alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5},
  email: { fontSize: 14, marginBottom: 25 },
  biografia: { fontSize: 12, marginBottom: 25 },
  settingsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: '#3e3e3e',
    marginBottom: 10,
  },
  logoutButton: { marginTop: 130, alignSelf: 'center', width: '60%'},
  logoutButtonGradient: { paddingVertical: 15, borderRadius: 25, alignItems: 'center',},
  logoutButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#e0e0e0' },
  confirmButton: { backgroundColor: '#52a86a' },
  modalButtonText: { color: 'white', fontWeight: 'bold',},
});

export default Profile;