import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchWithToken } from '../api';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const BASE_URL = "https://26a1-41-63-175-141.ngrok-free.app";

interface Option {
  id: number;
  nome: string;
}

const RegistroProdutoMobile = () => {
  const [postos, setPostos] = useState<Option[]>([]);
  const [funcionarios, setFuncionarios] = useState<Option[]>([]);
  const [lances, setLances] = useState<Option[]>([]);
  const [postoId, setPostoId] = useState<string | undefined>(undefined);
  const [funcionarioId, setFuncionarioId] = useState<string | undefined>(undefined);
  const [lanceId, setLanceId] = useState<string | undefined>(undefined);
  const [estadoProduto, setEstadoProduto] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [condicoesSelecionadas, setCondicoesSelecionadas] = useState<string[]>([]); // Armazenar as condições selecionadas

  const navigation = useNavigation();

  const fetchPostos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/postos/`);
      const data = await res.json();
      setPostos(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar postos");
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const res = await fetchWithToken(`${BASE_URL}/api/funcionarios/`);
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar funcionários");
    }
  };

  const fetchLances = async () => {
    try {
      const res = await fetchWithToken(`${BASE_URL}/api/lances/`);
      const data = await res.json();
      setLances(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar lances");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImagem(result.uri);
    }
  };

  const toggleCondicao = (condicao: string) => {
    setCondicoesSelecionadas((prevSelected) => {
      if (prevSelected.includes(condicao)) {
        return prevSelected.filter(item => item !== condicao); // Remove condição se já estiver selecionada
      } else {
        return [...prevSelected, condicao]; // Adiciona condição
      }
    });
  };

  const registrarProduto = async (tipo: "entrega" | "recebimento") => {
    if (!postoId || !funcionarioId || !lanceId || condicoesSelecionadas.length === 0) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const formData = new FormData();
    formData.append('posto_id', postoId);
    formData.append('funcionario_id', funcionarioId);
    formData.append('lance_id', lanceId);
    formData.append('estado_produto', condicoesSelecionadas.join(', '));  // Concatenando as condições selecionadas
    formData.append('observacoes', observacoes);
    if (imagem) {
      formData.append('imagem', {
        uri: imagem,
        name: 'produto.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const url = tipo === 'entrega' 
      ? `${BASE_URL}/api/posto/entregar-produto/` 
      : `${BASE_URL}/api/posto/receber-produto/`;

    try {
      const res = await fetchWithToken(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await res.json();
      Alert.alert("Sucesso", "Produto registrado com sucesso!");

      // Navegar de volta para a página inicial
      navigation.navigate('Home');  // Substitua 'Home' pelo nome da sua tela inicial

    } catch (error) {
      Alert.alert("Erro", "Erro ao registrar produto");
    }
  };

  useEffect(() => {
    fetchPostos();
    fetchFuncionarios();
    fetchLances();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Produto</Text>

      <Text style={styles.label}>Posto</Text>
      <Picker
        selectedValue={postoId}
        onValueChange={(itemValue) => setPostoId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um posto" value={undefined} />
        {postos.map((posto) => (
          <Picker.Item key={posto.id} label={posto.nome} value={posto.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Funcionário</Text>
      <Picker
        selectedValue={funcionarioId}
        onValueChange={(itemValue) => setFuncionarioId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um funcionário" value={undefined} />
        {funcionarios.map((func) => (
          <Picker.Item key={func.id} label={func.nome} value={func.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Lance</Text>
      <TextInput
        style={styles.textInput}
        value={lanceId}
        onChangeText={setLanceId}
        placeholder="Digite o ID do lance"
      />

      <Text style={styles.label}>Condições do Produto</Text>
      <View style={styles.checkBoxContainer}>
        {['É recondicionado?', 'É selado?', 'Está danificado?', 'Está com garantia?'].map((condicao) => (
          <TouchableOpacity
            key={condicao}
            style={styles.checkbox}
            onPress={() => toggleCondicao(condicao)}
          >
            <Text style={styles.checkboxText}>{condicao}</Text>
            {condicoesSelecionadas.includes(condicao) && <Text>✔️</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={styles.textInput}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Adicione observações"
      />

      <Button title="Selecionar Imagem" onPress={pickImage} />

      <Button title="Registrar Entrega" onPress={() => registrarProduto('entrega')} color="#007bff" />
      <View style={{ marginTop: 10 }}>
        <Button title="Registrar Recebimento" onPress={() => registrarProduto('recebimento')} color="#007bff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxText: {
    fontSize: 16,
  },
});

export default RegistroProdutoMobile;
