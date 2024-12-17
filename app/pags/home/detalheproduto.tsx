import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProducts } from './dp'; 
import useCart from './yh';  // Importando o novo hook

const DetalheProdutoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const { products, toggleFavorite, toggleBookmark } = useProducts();
  const { cartItems, toggleCart } = useCart();  // Usando o hook do carrinho

  const product = products.find((p) => p.id === productId);
  const cartAnimation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [showCartIcon, setShowCartIcon] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      setShowCartIcon(true);
    }
  }, [cartItems]);

  if (!product) return <Text style={styles.errorText}>Produto não encontrado!</Text>;

  // Verificando se o produto já está no carrinho
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    toggleCart(product); // Usando o toggleCart do hook
    Animated.sequence([
      Animated.spring(cartAnimation, {
        toValue: { x: 0, y: -30 },
        useNativeDriver: true,
      }),
      Animated.spring(cartAnimation, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalhes do Produto</Text>
      </View>
      
      <View style={styles.productInfo}>
        <Image source={product.image} style={styles.productImage} />
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={styles.detailValue}>{product.price}</Text>
        </View>
        
        {/* Ações */}
        <TouchableOpacity onPress={() => toggleFavorite(product.id)} style={styles.iconButton}>
          <MaterialCommunityIcons
            name={product.favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={product.favorite ? '#000' : '#000'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => toggleBookmark(product.id)} style={styles.iconButton}>
          <MaterialCommunityIcons
            name={product.bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={product.bookmarked ? '#000' : '#000'}
          />
        </TouchableOpacity>

        {/* Ícone do carrinho */}
        <TouchableOpacity onPress={handleAddToCart} style={styles.iconButton}>
          <MaterialCommunityIcons
            name={isInCart ? 'cart' : 'cart-plus'}
            size={24}
            color={isInCart ? '#000' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Animação */}
      <Animated.View style={[styles.cartAnimation, { transform: cartAnimation.getTranslateTransform() }]}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  productInfo: { padding: 20, backgroundColor: '#fff', borderRadius: 10, margin: 15 },
  productImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 15 },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 16, color: '#555' },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  iconButton: { padding: 10 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  priceText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  addToCartButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  errorText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: '#e63946' },
  cartAnimation: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 100,
    right: 20,
  },
});

export default DetalheProdutoScreen;
