import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchWithToken } from '../api';
import Config from '../Config';
const baseUrl = Config.getApiUrl(); // Substitua pela sua URL base

const ListaChats = () => {
  const [userChats, setUserChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null); // Substitua o tipo de 'userData' pelo tipo correto
  const navigation = useNavigation();

  // Função para buscar chats do usuário
  const fetchUserChats = async () => {
    try {
      if (userData?.nome) {
        console.log(`Buscando chats para o usuário: ${userData.nome}`); // Log para depuração
        const response = await fetchWithToken(`${baseUrl}api/chatrooms/user-list/${userData?.id}/`);
        const data = await response.json();
        if (response.ok) {
          console.log('Chats recebidos:', data.chats); // Log para depuração
          setUserChats(data.chats);
        } else {
          console.error('Erro ao buscar chats:', data.detail);
          setError('Erro ao buscar chats. Tente novamente mais tarde.');
        }
      } else {
        console.error('Nome do usuário não encontrado.');
        setError('Usuário não encontrado.');
      }
    } catch (error) {
      console.error("Erro ao buscar chats do usuário:", error);
      setError('Erro ao buscar chats. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para recuperar os dados do usuário do AsyncStorage com múltiplas tentativas
  const fetchUserData = async () => {
    try {
      const maxAttempts = 5;

      for (let attempts = 1; attempts <= maxAttempts; attempts++) {
        const storedUserData = await AsyncStorage.getItem('userData');

        if (storedUserData) {
          const userDataParsed = JSON.parse(storedUserData);
          setUserData(userDataParsed);

          console.log(`Tentativa ${attempts}: Dados do usuário recuperados:`, userDataParsed); // Log para depuração
          return; // Sai da função após obter os dados
        }

        console.log(`Tentativa ${attempts} de buscar dados do usuário`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos antes da próxima tentativa
      }

      console.error('Não foi possível buscar os dados após várias tentativas.');
      setError('Não foi possível recuperar os dados do usuário.'); // Define uma mensagem de erro
    } catch (error) {
      console.error('Erro ao recuperar dados:', error);
      setError('Erro ao recuperar dados. Redirecionando para login...');
      // Aqui você pode usar a navegação para redirecionar para a tela de login, se necessário
    }
  };

  useEffect(() => {
    fetchUserData(); // Tenta buscar os dados do usuário ao montar o componente
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserChats(); // Chama a busca dos chats apenas quando userData estiver disponível
    }
  }, [userData]);

  const renderChat = ({ item }) => {
    const isSeller = userData?.nome === item.vendedor.nome; // Verifica se o usuário atual é o vendedor
    const isBuyer = userData?.nome === item.comprador.nome; // Verifica se o usuário atual é o comprador
    
    // Armazena o tipo de usuário em uma variável
    let userRole;
    if (isSeller) {
      userRole = 'vendedor';
    } else if (isBuyer) {
      userRole = 'comprador';
    } else {
      userRole = 'desconhecido'; // Se o usuário não é nem vendedor nem comprador
    }

    return (
      <TouchableOpacity
        style={styles.messageCard}
        onPress={() => navigation.navigate('Chat', {
          sellerName: item.vendedor.nome, // Nome do vendedor
          userId: userData?.id, // ID do usuário, se disponível
          chatRoomId: item.id, // ID do chat
          produto_id:item.produto.id
        })}
      >
        <Text style={styles.name}>Chat com: {item.vendedor.nome} (Vendedor) - {item.comprador.nome} (Comprador)</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mensagens</Text>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={24} color="#888" />
        <TextInput placeholder="Pesquisar..." style={styles.searchInput} />
      </View>
      {userChats.length > 0 ? (
        <FlatList
          data={userChats}
          renderItem={renderChat}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>Nenhuma conversa encontrada.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, marginTop: 25 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 8, marginTop: 10, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  messageCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, marginVertical: 8, borderRadius: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  messageInfo: { flex: 1, marginLeft: 12 },
  name: { fontWeight: 'bold', fontSize: 16 },
  messageText: { color: '#888', fontSize: 14 },
  messageMeta: { alignItems: 'flex-end' },
  time: { fontSize: 12, color: '#888' },
  unreadBadge: { width: 10, height: 10, backgroundColor: '#f00', borderRadius: 5, marginTop: 4 },
  addButton: { position: 'absolute', right: 16, bottom: 32, backgroundColor: '#000', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', textAlign: 'center', fontSize: 16, marginTop: 20 },
});

export default ListaChats;
