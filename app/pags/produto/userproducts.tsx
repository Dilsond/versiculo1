import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchWithToken } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config';
import React, { useEffect, useState } from 'react';

const perfil = require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg');

const UserProducts = () => {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [produtoNome, setProdutoNome] = useState('');
  const baseUrl = Config.getApiUrl();

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

  useEffect(() => {
    if (!userData || !userData.id) return;

    const fetchUserProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          produto_nome_search: produtoNome,
        });

        const response = await fetchWithToken(`${baseUrl}api/produtos/usuario/${userData?.id}/?${queryParams}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos do usuário');
        }

        const data = await response.json();
        setProdutos(data.produtos || []);
      } catch (err) {
        setError('Erro ao buscar produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [produtoNome, userData]);

  const renderProduct = ({ item }) => (
    //onPress={() => navigation.navigate('ProdutoUpdateForm', { produto: item })}
    <View style={styles.productCard}>
      <View style={styles.cardHeader}>
      <TouchableOpacity onPress={() => navigation.navigate('ProdutoUpdateForm', { produto: item })}>
        <Text style={styles.atualizar}>Editar</Text>
      </TouchableOpacity>
        <Text style={styles.cardOwner} >{item.nome}</Text>
        <Text style={styles.cardTime}>{item.data_publicacao}</Text>
      </View>
      {item.imagens && item.imagens.length > 0 ? (
        <Image
          key={item.imagens[0].id}
          source={{ uri: baseUrl + item.imagens[0].imagem }}
          style={styles.productImage}
        />
      ) : (
        <Image
          source={require('../../../assets/notfound.jpg')}
          style={styles.productImage}
        />
      )}
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>{item.preco} KZ</Text>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.detailText}>{`${item.categoria.nome}`}</Text>
        <Text style={styles.detailText}>{`${item.condicao}`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Meus Produtos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={perfil} style={styles.avatar} />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={24} color="#888" />
        <TextInput
          placeholder="Buscar produto"
          style={styles.searchInput}
          value={produtoNome}
          onChangeText={setProdutoNome}
        />
      </View> */}
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          style={{ flex: 1}}
          data={produtos}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 3 }}
        />
      )}
       <View style={styles.footer}>
        <TouchableOpacity onPress={()=>{navigation.navigate('Main')}}>
          <MaterialCommunityIcons name="home" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('ProductsUser')}}>
          <MaterialCommunityIcons name="bookmark" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={()=>{navigation.navigate('ProdutoForm')}}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="account-group" size={24} color="#888" onPress={()=>{navigation.navigate('ListaMensagem')}}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="menu" size={24} color="#888" onPress={() => { navigation.navigate('MeusLances') }}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  cardOwner: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTime: {
    fontSize: 14,
    color: '#888',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  priceBadge: {
    position: 'absolute',
    top: 160,
    left: 16,
    backgroundColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProducts;
