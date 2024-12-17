import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const ContaScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const profileData = {
    name: "Dilsond…🕊 (@dilsond744)",
    joinedDate: "13 de Abril de 2023",
    previousNames: "Alterado 4 vezes no Instagram",
    profilePicture: require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg'), 
  };

  const menuItems = [
    {
      icon: <MaterialCommunityIcons name="account-outline" size={24} color="black" />,
      label: 'Dados Pessoais',
      onPress: () => navigation.navigate('DadosPessoaisScreen'),
    },
    {
      icon: <MaterialCommunityIcons name="account-lock-outline" size={24} color="black" />,
      label: 'Alterar Senha',
      onPress: () => navigation.navigate('AlterarPasse'),
    },
    {
      icon: <MaterialCommunityIcons name="account-details-outline" size={24} color="black" />,
      label: 'Sobre o teu perfil',
      onPress: handleOpenModal,
    },
    {
      icon: <MaterialCommunityIcons name="account-remove-outline" size={24} color="black" />,
      label: 'Desativar ou eliminar conta',
      onPress: () => navigation.navigate('DeleteScreen'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Conta</Text>
      </View>

      {/* Lista de Opções */}
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
          {item.icon}
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal} // Fecha ao tocar fora do modal
        onSwipeComplete={handleCloseModal} // Fecha ao deslizar para baixo
        swipeDirection="down" // Permite deslizar o modal para baixo
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Sobre o teu perfil</Text>
          <View style={styles.profileSection}>
            <Image source={profileData.profilePicture} style={styles.profilePicture} />
            <View>
              <Text style={styles.profileInfo}>Nome</Text>
              <Text style={styles.profileData}>{profileData.name}</Text>
            </View>
          </View>
          <Text style={styles.profileInfo}>Aderiu</Text>
          <Text style={styles.profileData}>{profileData.joinedDate}</Text>
          <Text style={styles.profileInfo}>Nomes de utilizador anteriores</Text>
          <Text style={styles.profileData}>{profileData.previousNames}</Text>
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 15,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 3,
    marginBottom: 15,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  profileData: {
    color: 'black',
    fontSize: 14,
    marginBottom: 15,
  },
});

export default ContaScreen;