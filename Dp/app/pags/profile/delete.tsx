import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DeleteScreen = () => {
  const navigation = useNavigation();
  const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Usuário apagou sua conta');
      // navigation.navigate('Login');
      setDeleteModalVisible(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleDisable = async () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Usuário desactivou sua conta');
      // navigation.navigate('Login');
      setDeactivateModalVisible(false);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Desactivar ou Eliminar</Text>
      </View>

      <View style={styles.profileSection}>

        <View style={styles.infoSection}>
          <Text style={styles.profileName}>Nome</Text>
          <Text style={styles.profileHandle}>Dilsond Domingos</Text>
        </View>

        <Image
          source={require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg')}
          style={styles.profileImage}
        />
      </View>


      <View style={styles.textInfo}>
        <Text style={styles.headerInfo}>A desativação da tua conta é temporária</Text>
        <Text style={styles.info}>A tua conta, os teus conteúdos e os teus gostos não vão estar visíveis para ninguém enquanto não iniciares sessão e reativares a tua conta.</Text>

        <Text style={styles.headerInfo}>A eliminação da tua conta é permanente</Text>
        <Text style={styles.info}>A tua conta, os teus conteúdos e os teus gostos vão ser ocultados antes de serem permanentemente removidos no prazo de 30 dias.</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => setDeactivateModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Desactivar Conta </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => setDeleteModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.buttonText2}>Eliminar Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Eliminar Conta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Eliminar Conta</Text>
                <Text style={styles.modalMessage}>
                  Tem certeza que deseja eliminar sua conta?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.modalButtonText2}>Eliminar Conta</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>


      {/* Modal para Desactivar Conta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeactivateModalVisible}
        onRequestClose={() => setDeactivateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Desativar Conta</Text>
                <Text style={styles.modalMessage}>
                  Tem certeza que deseja desativar sua conta?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeactivateModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleDisable}
                  >
                    <Text style={styles.modalButtonText2}>Desativar Conta</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 17,
  },
  profileSection: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#444',
  },
  infoSection: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  profileHandle: {
    fontSize: 14,
    color: '#000',
  },
  textInfo: {
    marginTop: 20,
    width: '88%',
    alignSelf: 'center',
  },
  headerInfo: {
    fontSize: 17,
    fontWeight: 900,
    color: '#000',
  },
  info: {
    marginTop: 5,
    marginBottom: 25,
    textAlign: 'justify'
  },
  buttons: {
    marginTop: 360,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    width: '100%',
    height: 50,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#000',
    fontWeight: 900,
    textAlign: 'center'
  },
  button2: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    width: '100%',
    marginTop: 15,
    backgroundColor: 'black',
    height: 50,
    justifyContent: 'center'
  },
  buttonText2: {
    color: '#ff4444',
    fontWeight: 900,
    textAlign: 'center'
  },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', padding: 20, borderRadius: 10, alignItems: 'center', backgroundColor: '#f5f5f5' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'gray' },
  confirmButton: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'gray' },
  modalButtonText: { color: 'black', fontWeight: 'bold', },
  modalButtonText2: { color: '#ff4444', fontWeight: 'bold' }

});

export default DeleteScreen;