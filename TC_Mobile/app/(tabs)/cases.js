import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import API from '../../lib/api';

const CaseCard = ({ item }) => (
    <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{item.subject}</Text>
            <View className={`px-2 py-1 rounded text-xs ${item.status === 'Open' ? 'bg-blue-100' : 'bg-green-100'}`}>
                <Text className={`${item.status === 'Open' ? 'text-blue-800' : 'text-green-800'} text-xs font-bold`}>
                    {item.status}
                </Text>
            </View>
        </View>
        <Text className="text-gray-500 text-sm mb-2">Ref: {item.name}</Text>
        <View className="flex-row justify-between items-center mt-2 border-t border-gray-100 pt-2">
            <Text className="text-gray-400 text-xs">Priority: {item.priority}</Text>
            <Text className="text-gray-400 text-xs">{item.modified?.split(' ')[0]}</Text>
        </View>
    </View>
);

export default function CasesScreen() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCases = async () => {
        try {
            // Placeholder: In a real app we'd need auth token storage
            // const data = await API.getMyCases(); 
            // setCases(data);

            // MOCK DATA for "Day 1" Demo until Auth is fully wired
            setCases([
                { name: 'TC-CASE-2024-001', subject: 'Internet Slow', status: 'Open', priority: 'High', modified: '2024-01-10' },
                { name: 'TC-CASE-2024-002', subject: 'Billing Question', status: 'Resolved', priority: 'Medium', modified: '2024-01-08' }
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCases();
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">My Tickets</Text>
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">+ New</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={cases}
                    renderItem={({ item }) => <CaseCard item={item} />}
                    keyExtractor={item => item.name}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-10">No tickets found</Text>
                    }
                />
            )}
        </View>
    );
}
