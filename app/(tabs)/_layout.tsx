import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="bills/index"
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: 'New Bill',
          tabBarIcon: ({ color, size }) => <Feather name="plus-square" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="providers/index"
        options={{
          title: 'Providers',
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
