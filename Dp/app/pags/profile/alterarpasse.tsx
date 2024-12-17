import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AlterarPasse = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('As novas senhas não coincidem!');
      return;
    }
    console.log('Senha alterada com sucesso!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={24}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>Alterar Senha</Text>
      </View>
      
      <View style={styles.content}>
      <Text style={styles.label}>Senha Atual:</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry={true}
      />
      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />
      <Text style={styles.label}>Confirmar Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.saveButtonText}>Alterar Senha</Text>
      </TouchableOpacity>
    </View>
      </View>

      
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: '#f5f5f5'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 17,
  },
  content:{ padding: 20},
  back: { marginBottom: 25},
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  saveButton: { backgroundColor: 'black', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 450 },
  saveButtonText: { color: 'white', fontWeight: '900', fontSize: 16 },
});

export default AlterarPasse;