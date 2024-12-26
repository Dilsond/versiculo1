import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../home/dp';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '@/app/Config';
import { fetchWithToken } from '../../api';


interface UserData {
  id: number;
  nome: string;
  email: string;
  numero_telefone: string;
  endereco: string;
  status: string;
  foto: string;
}

const PerfilScreen = () => {
  const navigation = useNavigation();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('meusProdutos');
  const baseUrl = Config.getApiUrl();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [produtoNome, setProdutoNome] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const asyncdata = await AsyncStorage.getItem('userData');
      if (asyncdata) {
        const userData = JSON.parse(asyncdata);
        setUserData(userData);

        if (userData.profile_image) {
          setProfileImage(`${baseUrl}${userData.profile_image}`);
        }
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
    <View style={styles.productCard}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('ProdutoUpdateForm', { produto: item })}>
          <Text style={styles.atualizar}>Editar</Text>
        </TouchableOpacity>
        <Text style={styles.cardOwner}>{item.nome}</Text>
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
          source={require('../../../assets/images/12345.jpg')}
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

  const savedProducts = products.filter((product) => product.bookmarked);

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
          <Text style={styles.profileName}>{userData?.nome}</Text>
          <Text style={styles.profileHandle}>{userData?.email}!</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditarUser')}>
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: userData?.foto ? baseUrl + userData.foto : 'defaultAvatarUrl' }}
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
        data={activeTab === 'meusProdutos' ? produtos : savedProducts}
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
  productCard: {
    flexDirection: 'column',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  atualizar: {
    color: '#0066cc',
  },
  cardOwner: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTime: {
    fontSize: 12,
    color: '#888',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  priceBadge: {
    backgroundColor: '#f8f8f8',
    padding: 5,
    borderRadius: 5,
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
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
