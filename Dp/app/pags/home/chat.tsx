import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Substitua com o caminho para a imagem de perfil
const profileImage = require('../../../assets/images/WhatsApp Image 2024-09-29 at 10.14.59.jpeg');

const ChatScreen = () => {
  const navigation = useNavigation();
  const messages = [
    
  ];

  const renderMessage = ({ item }) => {
    const isSent = item.type === 'sent';
    return (
      <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        {item.audio ? (
          <View style={styles.audioMessage}>
            <MaterialCommunityIcons name="microphone" size={24} color="#fff" />
            <Text style={styles.audioDuration}>{item.duration}</Text>
          </View>
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com imagem de perfil e nome */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* Imagem de perfil */}
        <Image source={profileImage} style={styles.avatar} />
        
        {/* Nome da pessoa */}
        <Text style={styles.headerText}>Domingos Cadete</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
      
      <View style={styles.inputBar}>
        <TextInput placeholder="Mensagem" style={styles.input} />
        <TouchableOpacity>
          <MaterialCommunityIcons name="send" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5',},
  
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
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
  audioMessage: { flexDirection: 'row', alignItems: 'center' },
  audioDuration: { color: '#fff', marginLeft: 8 },
  
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 8, marginRight: 8, height: 45 },
});

export default ChatScreen;
