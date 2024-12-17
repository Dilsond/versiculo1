import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from './dp';
import useCart from './yh';  // Importando o novo hook

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const lastOffsetY = useRef(0);
  const footerAnimation = useRef(new Animated.Value(1)).current;
  const { products, toggleFavorite, toggleBookmark } = useProducts();
  const { cartItems, toggleCart } = useCart();

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
            source={require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg')}
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
        renderItem={({ item }) => {
          const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
          return (
            <View style={styles.productCard}>
              <TouchableOpacity onPress={() => navigation.navigate('DetalheProdutoScreen', { productId: item.id })}>
                <Image source={item.image} style={styles.productImage} />
              </TouchableOpacity>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <MaterialCommunityIcons
                    name={item.favorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={item.favorite ? 'black' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                  <MaterialCommunityIcons
                    name={item.bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={item.bookmarked ? 'black' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleCart(item)}>
                  <MaterialCommunityIcons
                    name={isInCart ? 'cart' : 'cart-plus'}
                    size={24}
                    color={isInCart ? 'black' : 'black'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  userContainer: { flexDirection: 'row', alignItems: 'center' },
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


