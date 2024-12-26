import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Config from '@/app/Config';
import { fetchWithToken } from '@/app/api';
interface UserData {
    id: number;
    nome: string;
    email: string;
    numero_telefone: string;
    endereco: string;
    status: string;
    foto: string;
    data_de_registro:Date;
    data_nascimento:Date;
  }
const DadosPessoaisScreen = () => {
    const navigation = useNavigation();
    const baseUrl = Config.getApiUrl();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const asyncdata = await AsyncStorage.getItem('userData');
      if (asyncdata) {
        const userData = JSON.parse(asyncdata);
        setUserData(userData);

        if (userData.profile_image) {
          setProfileImage(`${baseUrl}${userData.profile_image}`);
        }
      }
    };

    fetchUserData();
  }, []);

    return (
        <ScrollView style={styles.container}>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Dados Pessoais</Text>
            </View>

            <View style={styles.textInfo}>
                <Text style={styles.info}>A nossa plataforma usa estas informações para verificar a tua identidade e para mantar a comunidade segura (mediante as negociações ou mesmo tranferencias de valores).</Text>
            </View>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Nome</Text>
                        <Text style={styles.profileHandle}>{userData?.nome}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Email</Text>
                        <Text style={styles.profileHandle}>{userData?.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Contacto</Text>
                        <Text style={styles.profileHandle}>{userData?.numero_telefone}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Data de Nascimento</Text>
                        <Text style={styles.profileHandle}>{userData?.data_nascimento}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginTop: 10,
    },
    headerText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 17,
    },
    profileSection: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 15,
    },
    infoSection: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    profileHandle: {
        fontSize: 14,
        color: '#000',
    },
    textInfo: {
        width: '90%',
        alignSelf: 'center',
    },
    headerInfo: {
        fontSize: 17,
        fontWeight: 900,
        color: '#000',
    },
    info: {
        fontSize: 15,
        marginBottom: 15,
        textAlign: 'justify'
    },

});

export default DadosPessoaisScreen;