import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#007bff' }}>
            <Tabs.Screen
                name="cases"
                options={{
                    title: 'Job Queue',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📋</Text>
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Ops Command',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>
                }}
            />
        </Tabs>
    );
}
