import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from '../Config';

interface Message {
  id: number;
  conteudo: string;
  remetente: string;
}

const ChatScreenWithoutChatroom = ({ route }) => {
  const { productId, userId, sellerName } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [websocket, setWebSocket] = useState<WebSocket | null>(null);
  const navigation = useNavigation();
  const baseUrlWs = Config.getApiUrlWs();

  useEffect(() => {
    const wsUrl = `wss://${baseUrlWs}/ws/new_chat/${userId}/`;
    console.log('Tentando conectar ao WebSocket em:', wsUrl);

    // Conecta ao WebSocket
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Conectado ao WebSocket');
      setWebSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        // Alert.alert('Erro', data.error);
        // Redireciona para a lista de chats caso já exista um chatroom
        if (data.error.includes('Redirecione o usuario')) {
          navigation.replace('Chat', { chatRoomId: data.chatroom_id,sellerName:sellerName,userId:userId });
        }
      } else if (data.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, conteudo: data.message, remetente: data.remetente },
        ]);
      }
    };

    ws.onclose = (e) => {
      console.log('Desconectado do WebSocket', e.code, e.reason);
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao WebSocket.');
    };

    // Limpa o WebSocket ao desmontar o componente
    return () => {
      ws.close();
    };
  }, [userId, productId, navigation]);

  const sendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Digite uma mensagem');
      return;
    }

    const data = {
      produto_id: productId,
      mensagem: message,
      remetente_id: userId,
    };

    // Envia a mensagem se o WebSocket estiver conectado
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(data));
      setMessage('');
    } else {
      Alert.alert('Erro', 'O WebSocket não está conectado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat com {sellerName}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.remetente === sellerName ? styles.receivedMessage : styles.sentMessage]}>
            <Text style={styles.sender}>{item.remetente}: </Text>
            <Text>{item.conteudo}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 8,
    maxWidth: '80%',
  },
  sender: {
    fontWeight: 'bold',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0f1012',
    padding: 12,
    borderRadius: 16,
    color: '#fff',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#8a8a8a',
    padding: 12,
    borderRadius: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default ChatScreenWithoutChatroom;
