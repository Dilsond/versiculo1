import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DadosPessoaisScreen = () => {
    const navigation = useNavigation();

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
                        <Text style={styles.profileHandle}>Dilsond Domingos</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Email</Text>
                        <Text style={styles.profileHandle}>dilsond744@gmail.com</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Contacto</Text>
                        <Text style={styles.profileHandle}>926364622</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.profileSection}>
                    <View style={styles.infoSection}>
                        <Text style={styles.profileName}>Data de Nascimento</Text>
                        <Text style={styles.profileHandle}>11 de Maio de 2005</Text>
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