import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from './dp';
import useCart from './yh';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../Config';
import { fetchWithToken } from '../../api'; 

const { width } = Dimensions.get('window');

interface UserData {
  id: number;
  nome: string;
  email: string;
  numero_telefone: string;
  endereco: string;
  status: string;
  foto:string;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const lastOffsetY = useRef(0);
  const footerAnimation = useRef(new Animated.Value(1)).current;
  const { products, toggleFavorite, toggleBookmark } = useProducts();
  const { cartItems, toggleCart } = useCart();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const baseUrl = Config.getApiUrl();

  const banners = [
    {
      image: require('../../../assets/images/surface.webp'),
      productId: '6',
    },
    {
      image: require('../../../assets/images/z_0_nb224556_AURICULARES-BLUETOOTH-QUALITYSOUND.jpg'),
      productId: '9',
    },
    {
      image: require('../../../assets/images/carros-economicos-1.jpeg'),
      productId: '1',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
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
  console.log(userData);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      flatListRef.current?.scrollToIndex({ index: (currentIndex + 1) % banners.length, animated: true });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffsetY > lastOffsetY.current;

    if (isScrollingDown && isFooterVisible) {
      setIsFooterVisible(false);
      Animated.timing(footerAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (!isScrollingDown && !isFooterVisible) {
      setIsFooterVisible(true);
      Animated.timing(footerAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastOffsetY.current = currentOffsetY;
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headertext}>Explore</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilScreen')}>
          <Image
            source={{ uri: userData?.foto ? baseUrl + userData.foto : 'defaultAvatarUrl' }} 

            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bannerContainer}>
        <FlatList
          ref={flatListRef}
          data={banners}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetalheProdutoScreen', { productId: item.productId })}>
              <Image source={item.image} style={styles.bannerImage} />
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={['Todos', 'Computador', 'Carros', 'Telefones', 'Acessórios']}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categories}
      />
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Produtos Populares</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VerTodosScreen')}>
          <Text style={styles.viewAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.cardHeader}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="message" size={24} color="#888" onPress={() =>
            navigation.navigate('ChatScreenWithoutChatroom', {
              productId: item.id,
              sellerName: item.usuario?.nome,
              userId: userData?.id,
            })
          } />
        </TouchableOpacity>
        <Text style={styles.productName}>{item.nome}</Text>
        <Text style={styles.productPrice}>{item.data_publicacao}</Text>
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
        <Text style={styles.detailText}>{item.categoria?.nome}</Text>
        <Text style={styles.detailText}>{item.condicao}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={renderProduct}
      />
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate('CarrinhoScreen')}
        >
          <MaterialCommunityIcons name="cart" size={30} color="white" />
        </TouchableOpacity>
      )}
      <Animated.View
        style={[
          styles.bottomNav,
          {
            transform: [
              { translateY: footerAnimation.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <MaterialCommunityIcons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('VerTodosScreen')}>
          <MaterialCommunityIcons name="magnify" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    marginTop: 80, // Para dar espaço para o header fixo
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  headertext: { fontSize: 24, fontWeight: 'bold' },
  bannerContainer: { height: 200, marginBottom: 20 },
  bannerImage: { width, height: 200 },
  categories: { marginHorizontal: 20, marginBottom: 10 },
  categoryButton: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginRight: 10 },
  categoryText: { color: '#000', fontWeight: 'bold' },
  productsSection: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  viewAll: { color: 'gray', fontSize: 14 },
  productCard: { flex: 1, margin: 10, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center' },
  productImage: { width: 150, height: 150, borderRadius: 10, marginBottom: 10 },
  productName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  productPrice: { fontSize: 12, color: '#555' },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
  priceBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#000', padding: 5, borderRadius: 5 },
  priceText: { color: '#fff', fontSize: 12 },
  productDetails: { marginTop: 10 },
  detailText: { fontSize: 12, color: '#555' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000', paddingVertical: 10, height: 60, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  cartIconContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default HomeScreen;
