import {Text} from 'react-native';
 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import Home from '../screens/Home';
import Agendamento from '../screens/Agendamento';
import Notificacoes from '../screens/Notificacoes';
import Perfil from '../screens/Perfil';
import Servicos from '../screens/Servicos';
import Loja from '../screens/Loja';
 
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
 
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B4FC6',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Início',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
 
      <Tab.Screen
        name="Agendamento"
        component={Agendamento}
        options={{
          title: 'Agendar',
          tabBarIcon: () => <Text>📅</Text>,
        }}
      />
 
      <Tab.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={{
          title: 'Notificações',
          tabBarIcon: () => <Text>🔔</Text>,
        }}
      />
 
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: 'Perfil',
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
 
export default function BottomNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
      />
 
      <Stack.Screen
        name="Servicos"
        component={Servicos}
      />
 
      <Stack.Screen
        name="Loja"
        component={Loja}
      />
    </Stack.Navigator>
  );
}