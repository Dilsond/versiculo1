import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const home = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                // Simular carregamento para experiência de splash
                await new Promise((resolve) => setTimeout(resolve, 1300));

                const storedUserData = await AsyncStorage.getItem('userData');

                if (storedUserData) {
                    // Redirecionar para "Main" se o usuário estiver autenticado
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    });
                } else {
                    // Redirecionar para "Login" se não houver dados armazenados
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoginScreen' }],
                    });
                }
            } catch (error) {
                console.error('Erro ao recuperar dados:', error);
                // Em caso de erro, redirecionar para login
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                });
            }
        };

        checkUserAuthentication();
    }, [navigation]);
    return (
        <View>
            <LinearGradient
                colors={['#121212', '#1e1e1e']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.container}
            >
                <Image
                    source={require('../../../assets/images/DD.png')}
                    style={styles.logoImage}
                />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoImage: {
        width: 250,
        height: 120,
        marginTop: 380,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default home;
