import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
 
import { fetchWithToken } from '../api'; // Ajuste o caminho conforme necessário
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
interface UserData {
  id:number;
  nome: string;
  email: string;
  numero_telefone: string;
  endereco: string;
  status: string;
  
}

const ProdutoForm = () => {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState<UserData | null>(null);
  const [descricao, setDescricao] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [condicao, setCondicao] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');
  const [productImages, setProductImages] = useState<any[]>([]);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [mapRegion, setMapRegion] = useState({
    latitude: -8.839987, 
    longitude: 13.289437,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const navigation = useNavigation();
  const baseUrl = Config.getApiUrl();

  useEffect(() => {
    const loadUserData = async () => {
      const asyncdata = await AsyncStorage.getItem('userData');
      if (asyncdata) {
        setUsername(JSON.parse(asyncdata));
      }
    };
    loadUserData();
    fetchCategorias();
  }, []);

  const fetchLocalizacaoAtual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErroMsg('Permissão para acessar a localização foi negada');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocalizacao(`${location.coords.latitude}, ${location.coords.longitude}`);
    setMapRegion({
      ...mapRegion,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const handleSelectLocationOnMap = () => {
    setModalVisible(true);
  };
   //Modal para escolher a localização 
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocalizacao(`${latitude}, ${longitude}`);
    setMapRegion({ ...mapRegion, latitude, longitude });
    setModalVisible(false); 
  };

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      return;
    }
  
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('categoria', categoria);
    formData.append('condicao', condicao);
    formData.append('localizacao', localizacao);
    formData.append('preco', preco);
    formData.append('status', status);
    formData.append('user_id', username?.id);
  
    productImages.forEach((image, index) => {
      if (index < 5) {
        formData.append(`imagem${index + 1}`, {
          uri: image.uri,
          name: `imagem_${index + 1}.jpg`,
          type: 'image/jpeg',
        });
      }
    });
  
    try {
      const response = await fetchWithToken(`${baseUrl}api/produto/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Produto criado com sucesso!');
        navigation.navigate("Main");
      } else {
        Alert.alert('Erro', data.detail || 'Erro desconhecido ao criar o produto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar o produto.');
      console.error('Erro:', error);
    }
  };
  

  const fetchCategorias = async () => {
    const maxAttempts = 4;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${baseUrl}api/categorias`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setCategorias(data);
          return;
        } else {
          throw new Error("A resposta da API não é um array.");
        }
      } catch (error) {
        console.error(`Erro ao buscar categorias na tentativa ${attempts + 1}:`, error);
      }

      attempts += 1;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    Alert.alert("Erro", "Não foi possível carregar as categorias após várias tentativas.");
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'A permissão para acessar a galeria é necessária para selecionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = [...productImages, ...result.assets];

      if (selectedImages.length > 5) {
        Alert.alert('Limite excedido', 'Você só pode enviar até 5 imagens.');
        setProductImages(selectedImages.slice(0, 5));
      } else {
        setProductImages(selectedImages);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#2e5764', '#73909a', '#2e5764']}  
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }} 

       style={styles.container}>
        <Text style={styles.logo}>Criar Produto</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          placeholderTextColor="#fff"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#fff"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text>Selecione uma Categoria:</Text>
        <Picker
          selectedValue={categoria}
          style={styles.input}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.nome} />
            ))
          ) : (
            <Picker.Item label="Nenhuma categoria disponível" value="" />
          )}
        </Picker>

        <Text>Localização:</Text>
        <TextInput
          style={styles.input}
          placeholder="Localização"
          placeholderTextColor="#fff"
          value={localizacao}
          onChangeText={setLocalizacao}
        />
        {erroMsg ? <Text>{erroMsg}</Text> : null}

        {/* <TouchableOpacity style={styles.button} onPress={fetchLocalizacaoAtual}>
          <Text style={styles.buttonText}>Usar localização atual</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSelectLocationOnMap}>
          <Text style={styles.buttonText}>Selecionar localização no mapa</Text>
        </TouchableOpacity> */}
       

        <Text>Selecione uma Condição:</Text>
        <Picker
          selectedValue={condicao}
          onValueChange={(itemValue) => setCondicao(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Selecione a condição" value="" />
          <Picker.Item label="Novo" value="novo" />
          <Picker.Item label="Usado" value="usado" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Preço"
          placeholderTextColor="#fff"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleImagePick}>
          <Text style={styles.buttonText}>Selecionar Imagens (até 5)</Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {productImages.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Criar Produto</Text>
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

      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#73909a',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
  },
  map: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
  },
});

export default ProdutoForm;
