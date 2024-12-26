import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pags/home/main';
import PerfilScreen from '../pags/profile/view';
import ContaScreen from '../pags/profile/conta';
import home from '../pags/onboarding/page';
import ConfigScreen from '../pags/profile/config';
import AlterarPasse from '../pags/profile/alterarpasse';
import DeleteScreen from '../pags/profile/delete';
import EditarUser from '../pags/profile/editarperfil'
import DadosPessoaisScreen from '../pags/profile/dadospessoais';
import ReacaoScreen from '../pags/profile/gosto';
import DetalheProdutoScreen from '../pags/home/detalheproduto';
import ChatScreen from '../pags/home/chat';
import VerTodosScreen from '../pags/home/vertodos';
import CarrinhoScreen from '../pags/home/carrinho';
import LoginScreen from '../pags/login/login';
import { ProductsProvider } from '../pags/home/dp';

const Stack = createNativeStackNavigator();

export default function Rotas() {
  return (
    <ProductsProvider>
      <Stack.Navigator initialRouteName='home' >
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PerfilScreen" component={PerfilScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeleteScreen" component={DeleteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContaScreen" component={ContaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlterarPasse" component={AlterarPasse} options={{ headerShown: false }} />
        <Stack.Screen name="EditarUser" component={EditarUser} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="home" component={home} options={{ headerShown: false }} />
        <Stack.Screen name="DadosPessoaisScreen" component={DadosPessoaisScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DetalheProdutoScreen" component={DetalheProdutoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerTodosScreen" component={VerTodosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReacaoScreen" component={ReacaoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CarrinhoScreen" component={CarrinhoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ProductsProvider>
  );
};