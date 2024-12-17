import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarrinhoScreen = ({ route }) => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);

  // Carregar os itens do carrinho armazenados
  useEffect(() => {
    const loadCartItems = async () => {
      const storedItems = await AsyncStorage.getItem('cartItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setCartItems(parsedItems);
      }
    };
    loadCartItems();
  }, []);

  // Atualizar os itens no armazenamento local
  const updateCartStorage = async (updatedItems) => {
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateCartStorage(updatedItems);
  };

 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meu Carrinho</Text>
      </View>

      {/* Cart Items */}
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#e63946" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyCartText}>Seu carrinho está vazio!</Text>
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  itemDetails: { flex: 1, marginLeft: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemPrice: { fontSize: 14, color: '#555' },
  emptyCartText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: '#777' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  checkoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});

export default CarrinhoScreen;
