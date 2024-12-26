import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Config from '../Config';
import { fetchWithToken } from '../api';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';

interface Imagem {
  id: number;
  imagem: string;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  imagens: Imagem[];
}

const ProdutoUpdateForm = ({ route, navigation }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [novasImagens, setNovasImagens] = useState<any[]>([]);
  const [imagensParaRemover, setImagensParaRemover] = useState<number[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -8.839987,
    longitude: 13.289437,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const baseUrl = Config.getApiUrl();

  useEffect(() => {
    const { produto } = route.params;
    if (produto) {
      setId(produto.id);
      setNome(produto.nome);
      setDescricao(produto.descricao);
      setPreco(produto.preco.toString());
      setLocalizacao(produto.localizacao || '');
      setStatus(produto.status || '');
      setImagens(produto.imagens || []);

      const [latitude, longitude] = produto.localizacao.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }
  }, [route.params]);

  const handleUpdate = async () => {
    if (!nome || !descricao || !preco || !localizacao || !status) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', parseFloat(preco).toString());
      formData.append('localizacao', localizacao);
      formData.append('status', status);

      if (imagensParaRemover.length > 0) {
        formData.append('imagens_para_remover', JSON.stringify(imagensParaRemover));
      }

      novasImagens.forEach((imagem, index) => {
        formData.append(`imagem${index + 1}`, {
          uri: imagem.uri,
          type: 'image/jpeg',
          name: `imagem_${index + 1}.jpg`,
        });
      });

      console.log('Dados do produto a serem enviados:', formData);

      const response = await fetchWithToken(`${baseUrl}api/produto/${id}/atualizar/`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.detail || 'Não foi possível atualizar o produto.');
        return;
      }

      Alert.alert('Sucesso', 'Produto atualizado com sucesso');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
      console.error(error);
    }
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Erro', 'Você precisa dar permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setNovasImagens([...novasImagens, { uri: newImage }]);
    }
  };

  const handleRemoveImage = async (index: number, imagemId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');  
      const response = await fetchWithToken(`${baseUrl}api/imagem/${imagemId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        Alert.alert('Erro', 'Não foi possível remover a imagem.');
        return;
      }
  
      setImagens(imagens.filter((_, i) => i !== index));
      Alert.alert('Sucesso', 'Imagem removida com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao remover a imagem.');
      console.error(error);
    }
  };

  const fetchLocalizacaoAtual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a localização foi negada');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocalizacao(`${latitude}, ${longitude}`);
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const handleSelectLocationOnMap = () => {
    setModalVisible(true);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setLocalizacao(`${latitude}, ${longitude}`);
      setMapRegion({ ...mapRegion, latitude, longitude });
    } else {
      console.error('Coordenadas inválidas:', latitude, longitude);
    }
    setModalVisible(false);
  };

  const handleRemoveNewImage = (index: number) => {
    setNovasImagens(novasImagens.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />

      <Text style={styles.label}>Preço:</Text>
      <TextInput style={styles.input} value={preco} keyboardType="numeric" onChangeText={setPreco} />

      <Text style={styles.label}>Localização:</Text> 
      <TextInput style={styles.input} value={localizacao} onChange={setLocalizacao}/>
      {/* <TouchableOpacity onPress={fetchLocalizacaoAtual} style={styles.button}>
        <Text style={styles.buttonText}>Usar localização atual</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelectLocationOnMap} style={styles.button}>
        <Text style={styles.buttonText}>Selecionar localização no mapa</Text>
      </TouchableOpacity> */}
      <Text style={styles.label}>Status:</Text>
      <TextInput style={styles.input} value={status} onChangeText={setStatus} />

      <TouchableOpacity onPress={handleAddImage} style={styles.button}>
        <Text style={styles.buttonText}>Adicionar Imagem</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Imagens Existentes:</Text>
      <FlatList
        data={imagens}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: baseUrl + item.imagem }} style={styles.image} />
            <Text>ID da imagem: {item.id}</Text> 
            <TouchableOpacity onPress={() => handleRemoveImage(index, item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.label}>Novas Imagens:</Text>
      <FlatList
        data={novasImagens}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => handleRemoveNewImage(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Atualizar Produto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <MapView
          style={styles.map}
          region={mapRegion}
          onPress={handleMapPress}
          provider={PROVIDER_DEFAULT}
        >
          <Marker coordinate={mapRegion} />
        </MapView>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Fechar</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginVertical: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 20 },
  imageContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  image: { width: 100, height: 100, borderRadius: 5, marginRight: 10 },
  removeButton: { backgroundColor: 'red', padding: 5, borderRadius: 5 },
  removeButtonText: { color: 'white' },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: 'white', fontSize: 16 },
  map: { width: '100%', height: '100%' },
  closeButton: { backgroundColor: '#007BFF', padding: 10, alignItems: 'center' },
});

export default ProdutoUpdateForm;
