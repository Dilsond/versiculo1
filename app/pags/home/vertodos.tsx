import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VerTodosScreen = () => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState(""); // Termo digitado
    const [searchHistory, setSearchHistory] = useState([]); // Histórico de pesquisa

    const products = [
        { id: '1', name: 'Carro - FIAT 360', price: '$25.99', image: require('../../../assets/images/carros-economicos-1.jpeg') },
        { id: '2', name: 'Telefone Antigo', price: '$255.99', image: require('../../../assets/images/615vPLc0dDL._AC_UF1000,1000_QL80_.jpg') },
        { id: '3', name: 'Auriculares sem fio', price: '$71.99', image: require('../../../assets/images/aw220226.png') },
        { id: '4', name: 'Telefone de Escritório', price: '$884.99', image: require('../../../assets/images/d303884e6128dfb0bd1d2a8fa0b21721.webp') },
        { id: '5', name: 'Telefone de Botão', price: '$345.99', image: require('../../../assets/images/D_NQ_NP_871327-MLB52614031027_112022-O.webp') },
        { id: '6', name: 'Computador HP', price: '$755.99', image: require('../../../assets/images/surface.webp') },
        { id: '8', name: 'Iphone 13pro Max', price: '$255.99', image: require('../../../assets/images/https-s3.amazonaws.com-allied.alliedmktg.com-img-apple-iPhone-2013-iPhone-2013-20Pro-TCDAP872-1.jpg') },
        { id: '9', name: 'Carro Peugeot', price: '$44.99', image: require('../../../assets/images/peugeot-e-208.webp') },
        { id: '11', name: 'Auscutadores', price: '$878.99', image: require('../../../assets/images/z_0_nb224556_AURICULARES-BLUETOOTH-QUALITYSOUND.jpg') },
    ];

    // Filtrar produtos com base no termo pesquisado
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para adicionar ao histórico e buscar
    const handleSearchSubmit = () => {
        if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
            setSearchHistory([searchTerm, ...searchHistory]);
        }
        setSearchTerm(""); // Limpa o campo de busca
    };

    return (
        <View style={styles.container}>
            {/* Header com barra de pesquisa */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-u-left-top" size={24} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="Pesquisar..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearchSubmit}
                        placeholderTextColor="#888"
                    />
                </View>
            </View>

            {/* Histórico de Pesquisa */}
            {searchHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <FlatList
                        data={searchHistory}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.historyItem}>
                                <TouchableOpacity
                                    onPress={() => setSearchTerm(item)} // Reutiliza o termo ao tocar
                                    style={styles.historyTextContainer}
                                >
                                    <MaterialCommunityIcons name="magnify" size={20} color="#000" />
                                    <Text style={styles.historyText}>{item}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setSearchHistory(searchHistory.filter((term) => term !== item))} // Remove do histórico
                                >
                                    <MaterialCommunityIcons name="close" size={20} color="#888" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}

            {/* Lista de Produtos Filtrados */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.productsContainer}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('DetalheProdutoScreen', { productId: item.id })}
                            style={styles.productTouchable}
                        >
                            <Image source={item.image} style={styles.productImage} />
                        </TouchableOpacity>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>{item.price}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.noResultsText}>Nenhum produto encontrado</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 10,
        flex: 1,
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    historyContainer: {
        marginTop: 10,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    historyTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    productsContainer: {
        paddingBottom: 20,
    },
    productCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    productTouchable: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    productImage: {
        width: 130,
        height: 130,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#333',
    },
    productPrice: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
    },
    noResultsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    
});

export default VerTodosScreen;
