import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../Config';
import { fetchWithToken } from '../../api'; 

const ConfigScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userData, setUserData] = useState(null);

  const toggleNotifications = () => {
    setNotificationsEnabled(!isNotificationsEnabled);
    console.log(`Notificações ${!isNotificationsEnabled ? 'ativadas' : 'desativadas'}`);
  };

  const menuItems = [
    { icon: <Ionicons name="person-circle-outline" size={24} color="black" />, label: 'Conta', onPress: () => navigation.navigate('ContaScreen') },
    { icon: <Ionicons name="notifications-outline" size={24} color="black" />, label: 'Notificações', isSwitch: true },
    { icon: <Ionicons name="heart-outline" size={24} color="black" />, label: 'Com reação Gosto', onPress: () => navigation.navigate('ReacaoScreen') },
    { icon: <Ionicons name="arrow-undo-outline" size={24} color="black" />, label: 'Produtos Vendidos', onPress: () => navigation.navigate('') },
    { icon: <Ionicons name="information-circle-outline" size={24} color="black" />, label: 'Sobre', onPress: () => navigation.navigate('') },
  ];

  const baseUrl = Config.getApiUrl(); 
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
    navigation.replace("LoginScreen");
    
    
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Definições</Text>
      </View>

      {/* Lista de Opções */}
      {menuItems.map((item, index) => (
        <View key={index} style={styles.menuItem}>
          {item.icon}
          {item.isSwitch ? (
            <TouchableOpacity style={styles.switchContainer} onPress={toggleNotifications}>
              <Text style={styles.menuText}>{item.label}</Text>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={toggleNotifications}
                thumbColor={isNotificationsEnabled ? '#fff' : '#000'}
                trackColor={{ false: '#ccc', true: '#000' }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.menuItemTouchable} onPress={item.onPress}>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}


      {/* Terminar sessão */}
      <View style={styles.accountOptions}>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Terminar sessão</Text>
        </TouchableOpacity>
      </View>



      {/* Modal para término de sessão */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Terminar Sessão</Text>
                <Text style={styles.modalMessage}>Tem certeza que deseja terminar a sessão?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleLogout}>
                    <Text style={styles.modalButtonText2}>Terminar Sessão</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: 10 },
  headerText: { color: 'black', fontSize: 18, fontWeight: 'bold', marginLeft: 17 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20 },
  menuText: { color: 'black', fontSize: 16, marginLeft: 15, flex: 1 },
  accountOptions: { marginTop: 460, paddingHorizontal: 20 },
  logoutText: { color: '#ff4444', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', padding: 20, borderRadius: 10, alignItems: 'center', backgroundColor: '#f5f5f5' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5,},
  cancelButton: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'gray' },
  confirmButton: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'gray' },
  modalButtonText: { color: 'black', fontWeight: 'bold' },
  modalButtonText2: { color: '#ff4444', fontWeight: 'bold' },


  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  menuItemTouchable:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  }
  

});

export default ConfigScreen;
