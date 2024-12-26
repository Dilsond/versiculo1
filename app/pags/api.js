// api.js ou authHelpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import Config from './Config';
const baseUrl = Config.getApiUrl(); // A URL da sua API


const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decodedPayload = jwt_decode(token);
    return decodedPayload.exp < Date.now() / 1000; // Verifica se o token está expirado
  } catch (error) {
    console.error('Erro ao decodificar o token JWT:', error);
    return true; // Considera que o token está expirado em caso de erro
  }
};

// Função para renovar o access token usando o refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${baseUrl}api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('accessToken', data.access); // Armazena o novo access token
      return data.access; // Retorna o novo access token
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Erro ao renovar o access token:', error);
    return null;
  }
};

// Função principal que verifica o token e faz a requisição
export const fetchWithToken = async (url, options = {}) => {
  let accessToken = await AsyncStorage.getItem('accessToken');

  // Verifica se o access token está expirado
  if (isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken(); // Renova o token se expirado
  }

  // Se ainda não houver um access token válido, o usuário deve fazer login
  if (!accessToken) {
    throw new Error('User needs to log in');
  }

  // Adiciona o token de autorização no cabeçalho da requisição
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, authOptions);
  return response;
};
