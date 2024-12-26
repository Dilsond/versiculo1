import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import Config from '@/app/Config';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [produtoNome, setProdutoNome] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoMaximo, setPrecoMaximo] = useState('');

  const baseUrl = Config.getApiUrl();

  useEffect(() => {
    const fetchUserData = async () => {
      const asyncdata = await AsyncStorage.getItem('userData');
      if (asyncdata) {
        const parsedData = JSON.parse(asyncdata);
        setUserData(parsedData);
      }
    };

    fetchUserData();
    fetchToken();
  }, []);

  useEffect(() => {
    if (userData) {
      registerDevice();
    }
  }, [userData]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchFilteredProdutos();
    }
  }, [produtoNome, categoriaId, precoMinimo, precoMaximo, userData]);

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('accessTokenFirebase');
    console.log('Token de acesso:', token);
  };

  const registerDevice = async () => {
    try {
      const tokenFirebase = await AsyncStorage.getItem('accessTokenFirebase');
      const plataforma = Platform.OS;

      if (!userData?.id || !tokenFirebase || !plataforma) {
        Alert.alert('Erro', 'Dados incompletos para registrar dispositivo.');
        return;
      }

      const response = await fetch(`${baseUrl}api/dispositivo-create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: userData.id,
          token: tokenFirebase,
          plataforma,
        }),
      });

      if (response.ok) {
        console.log('Dispositivo registrado com sucesso!');
      } else {
        const data = await response.json();
        console.log('Erro:', data.erro || 'Erro ao registrar dispositivo');
      }
    } catch (error) {
      console.error('Erro ao registrar dispositivo:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${baseUrl}api/categorias`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategorias(data);
      } else {
        throw new Error('A resposta da API não é um array.');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  };

  const fetchFilteredProdutos = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        produto_nome_search: produtoNome,
        categoria_id: categoriaId,
        preco_minimo: precoMinimo,
        preco_maximo: precoMaximo,
      });

      const response = await fetch(`${baseUrl}api/produtos-search/${userData?.id}/?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await response.json();
      setProducts(data.produtos || []);
    } catch (err) {
      setError('Erro ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, favorite: !product.favorite } : product
      )
    );
  };

  const toggleBookmark = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, bookmarked: !product.bookmarked } : product
      )
    );
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categorias,
        loading,
        error,
        toggleFavorite,
        toggleBookmark,
        setProdutoNome,
        setCategoriaId,
        setPrecoMinimo,
        setPrecoMaximo,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
