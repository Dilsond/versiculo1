import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Carregar os itens do carrinho do AsyncStorage
  useEffect(() => {
    const loadCartItems = async () => {
      const storedItems = await AsyncStorage.getItem('cartItems');
      if (storedItems) {
        setCartItems(JSON.parse(storedItems));
      }
    };
    loadCartItems();
  }, []);

  // Função para adicionar ou remover itens do carrinho
  const toggleCart = async (product) => {
    const isInCart = cartItems.some((item) => item.id === product.id);

    let updatedCartItems;
    if (isInCart) {
      updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    } else {
      updatedCartItems = [...cartItems, product];
    }

    setCartItems(updatedCartItems);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  return {
    cartItems,
    setCartItems,
    toggleCart,
  };
};

export default useCart;
