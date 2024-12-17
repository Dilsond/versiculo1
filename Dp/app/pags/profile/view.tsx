import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../home/dp';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('meusProdutos');

  const savedProducts = products.filter((product) => product.bookmarked);

  const renderProduct = ({ item }) => {
    const imageUri = item.image && Image.resolveAssetSource(item.image).uri;

    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => navigation.navigate('DetalheProdutoScreen', { productId: item.id })}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ConfigScreen')}>
          <MaterialCommunityIcons name="menu" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.infoSection}>
          <Text style={styles.profileName}>Dilsond...</Text>
          <Text style={styles.profileHandle}>Vamos ser felizes!</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditarUser')}>
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg')}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('meusProdutos')}
        >
          <Text style={[styles.tabText, activeTab === 'meusProdutos' && styles.activeTab]}>Meus Produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('guardados')}
        >
          <Text style={[styles.tabText, activeTab === 'guardados' && styles.activeTab]}>Guardados</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'meusProdutos' ? products : savedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          activeTab === 'guardados' && (
            <Text style={styles.emptyText}>Nenhum produto guardado ainda.</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  icon: {
    marginHorizontal: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 15,
    backgroundColor: '#444',
  },
  infoSection: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  profileHandle: {
    fontSize: 14,
    color: '#000',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    width: 150,
    marginTop: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#000',
    marginTop: 20,
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTab: {
    fontSize: 20,
    color: 'black',
    fontWeight: '900',
  },
  productList: {
    padding: 10,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default PerfilScreen;