import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Button, StyleSheet,Modal } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchWithToken } from '../api';
import Config from '../Config';
import { Picker } from '@react-native-picker/picker'; // Para o select


const Chat = ({ route }) => {
  const { sellerId, sellerName, userId, chatRoomId,produto_id } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [postos, setPostos] = useState<any[]>([]); // Lista de postos
  const [postoSelecionado, setPostoSelecionado] = useState<string>('');
  const baseUrl = Config.getApiUrl();
  const baseUrlWs = Config.getApiUrlWs();
  const navigation = useNavigation();

  // Função para buscar mensagens
  const fetchMessages = async () => {
    try {
      const response = await fetchWithToken(`${baseUrl}api/chatrooms/messages/${chatRoomId}/`);
      const data = await response.json();
  
      if (response.ok) {
        if (Array.isArray(data.mensagens)) {
          setMessages(data.mensagens.map(msg => ({
            remetente: msg.remetente,
            conteudo: msg.conteudo,
            criado_em: msg.criado_em,
          })));
        }
      } else {
        console.error('Erro ao buscar mensagens:', data.detail);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };
  const fetchPostos = async () => {
    try {
      const response = await fetchWithToken(`${baseUrl}api/postos/`); // Endpoint para buscar postos
      const data = await response.json();
      
      if (response.ok) {
        setPostos(data);
      } else {
        console.error('Erro ao buscar postos:', data.detail);
      }
    } catch (error) {
      console.error('Erro ao buscar postos:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, 5000); // Chama fetchMessages a cada 5 segundos

    const socket = new WebSocket(`wss://${baseUrlWs}/ws/chat/${encodeURIComponent(sellerName)}/`);
    socket.onopen = () => console.log('Conectado ao WebSocket');

    socket.onmessage = async (event) => {
      const { message, remetente, messageId, notificacao } = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { remetente: { nome: remetente }, conteudo: message, criado_em: new Date() }
      ]);

      if (images.length > 0) {
        await sendImages(messageId);
        setImages([]);
      }

      Alert.alert('Nova Notificação', notificacao.mensagem);
    };

    socket.onclose = () => console.log('WebSocket desconectado');
    setWs(socket);
    fetchPostos(); // Buscar postos ao montar o componente

    return () => {
      clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
      socket.close();
    };
  }, [sellerName]);

  // Função para enviar mensagens
  const sendMessage = async () => {
    if (messageText.trim() === '' && images.length === 0) {
      Alert.alert('Por favor, digite uma mensagem ou selecione uma imagem.');
      return;
    }

    const message = {
      mensagem: messageText,
      chatroom_id: chatRoomId,
      remetente_id: userId,
    };

    if (chatRoomId) {
      ws?.send(JSON.stringify(message));
    } else {
      try {
        const createChatRoomResponse = await fetchWithToken(`${baseUrl}api/chatrooms/`, {
          method: 'POST',
          body: JSON.stringify({
            vendedor: sellerId,
            comprador: userId,
          }),
        });

        if (createChatRoomResponse.ok) {
          const newChatRoomData = await createChatRoomResponse.json();
          const newChatRoomId = newChatRoomData.id;

          ws?.send(JSON.stringify({
            ...message,
            chatRoomId: newChatRoomId
          }));
        } else {
          console.error('Erro ao criar chatroom:', await createChatRoomResponse.json());
        }
      } catch (error) {
        console.error('Erro ao criar chatroom:', error);
      }
    }

    setMessageText('');
  };

  // Função para enviar imagens
  const sendImages = async (messageId: string) => {
    const formData = new FormData();
    formData.append('mensagem_id', messageId);

    images.forEach((img, index) => {
      formData.append(`imagem${index + 1}`, {
        uri: img.uri,
        name: `imagem_${index + 1}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await fetchWithToken(`${baseUrl}api/imagem-mensagem/create/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Erro ao enviar imagens:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
    }
  };

  // Função para selecionar imagens
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };
  const createLance = async () => {
    if (!descricao || !preco || !postoSelecionado) {
      Alert.alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetchWithToken(`${baseUrl}api/lance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Definir o cabeçalho Content-Type como application/json
        },
        body: JSON.stringify({
          usuario_id: userId,
          produto_id: produto_id,
          posto_id: postoSelecionado,
          descricao: descricao,
          preco: preco,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Lance criado com sucesso!');
        setModalVisible(false); // Fechar modal após sucesso
      } else {
        Alert.alert('Erro ao criar lance', data.detail);
      }
    } catch (error) {
      console.error('Erro ao criar lance:', error);
      Alert.alert('Erro ao criar lance');
    }
  };
  const renderMessage = ({ item }: any) => {
    const isSent = item.remetente.nome === sellerName; // Define quem enviou a mensagem
    return (
      <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={styles.messageText}>{item.conteudo}</Text>
        <Text style={styles.messageTime}>{new Date(item.criado_em).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com imagem de perfil e nome */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerText}>{sellerName}</Text>
        {/* Botão para abrir modal */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.createLanceButton}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Input de mensagem */}
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Digite sua mensagem"
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Botão para selecionar imagens */}
      <Button title="Selecionar Imagens" onPress={pickImage} />

      {/* Modal para criar lance */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Lance</Text>
            
            <TextInput
              placeholder="Descrição"
              style={styles.modalInput}
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              placeholder="Preço"
              style={styles.modalInput}
              value={preco}
              keyboardType="numeric"
              onChangeText={setPreco}
            />

            <Picker
              selectedValue={postoSelecionado}
              onValueChange={(itemValue) => setPostoSelecionado(itemValue)}
              style={styles.modalInput}
            >
              <Picker.Item label="Selecione um posto" value="" />
              {postos.map((posto) => (
                <Picker.Item key={posto.id} label={posto.nome} value={posto.id} />
              ))}
            </Picker>

            <Button title="Criar Lance" onPress={createLance} />
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', marginTop: 25 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  messageBubble: { padding: 12, borderRadius: 16, marginVertical: 8, maxWidth: '80%' },
  sentBubble: { alignSelf: 'flex-end', backgroundColor: '#0f1012' },
  receivedBubble: { alignSelf: 'flex-start', backgroundColor: '#8a8a8a' },
  messageText: { color: '#fff', fontSize: 16 },
  messageTime: { fontSize: 12, marginTop: 4, color: '#fff', alignSelf: 'flex-end' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 8, marginRight: 8, height: 45 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalInput: { width: '100%', padding: 10, marginBottom: 12, borderWidth: 1, borderRadius: 8 },
});

export default Chat;
