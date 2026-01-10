import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#007bff' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>
                }}
            />
            <Tabs.Screen
                name="cases"
                options={{
                    title: 'My Tickets',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>🎫</Text>
                }}
            />
        </Tabs>
    );
}
