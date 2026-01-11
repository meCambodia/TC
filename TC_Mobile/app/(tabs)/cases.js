import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import API from '../../lib/api';
import { useRouter } from 'expo-router';

const StatusBadge = ({ status }) => {
    let colorClass = "bg-gray-100 text-gray-800";
    if (status === 'Open') colorClass = "bg-blue-100 text-blue-800";
    if (status === 'In Progress') colorClass = "bg-yellow-100 text-yellow-800";
    if (status === 'Resolved') colorClass = "bg-green-100 text-green-800";

    return (
        <View className={`px-2 py-1 rounded ${colorClass.split(' ')[0]}`}>
            <Text className={`${colorClass.split(' ')[1]} text-xs font-bold`}>
                {status}
            </Text>
        </View>
    );
};

export default function CasesScreen() {
    const router = useRouter();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        setupUser();
        fetchCases();
    }, []);

    const setupUser = async () => {
        try {
            const details = await API.getUserDetails();
            setUserRoles(details.roles || []);
        } catch (e) {
            console.log("Failed to load user roles", e);
        }
    };

    const fetchCases = async () => {
        try {
            const data = await API.getMyCases();
            setCases(Array.isArray(data) ? data : (data.message || []));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleStatusUpdate = async (caseId, newStatus) => {
        try {
            await API.updateStatus(caseId, newStatus);
            Alert.alert("Success", `Case marked as ${newStatus}`);
            fetchCases(); // Refresh list to see change
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCases();
    };

    // LOGIC: Determine if user is Technical/Admin
    const isTech = userRoles.includes("System Manager") || userRoles.includes("System User") || userRoles.includes("Support Team");

    const renderItem = ({ item }) => (
        <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-xs text-gray-500 font-medium">{item.name}</Text>
                    <Text className="text-lg font-bold text-gray-900 mt-1">{item.subject}</Text>
                </View>
                <StatusBadge status={item.status} />
            </View>

            <View className="flex-row items-center mt-2 space-x-3">
                <Text className="text-xs text-gray-400">📅 {item.modified?.split(' ')[0]}</Text>
                {item.priority === 'Critical' && (
                    <Text className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">⚡ Critical</Text>
                )}
            </View>

            {/* TECHNICIAN ACTIONS */}
            {isTech && item.status === 'Open' && (
                <TouchableOpacity
                    onPress={() => handleStatusUpdate(item.name, 'In Progress')}
                    className="mt-4 bg-blue-600 p-3 rounded-lg items-center active:opacity-80"
                >
                    <Text className="text-white font-bold">Accept Job</Text>
                </TouchableOpacity>
            )}

            {isTech && item.status === 'In Progress' && (
                <TouchableOpacity
                    onPress={() => handleStatusUpdate(item.name, 'Resolved')}
                    className="mt-4 bg-green-600 p-3 rounded-lg items-center active:opacity-80"
                >
                    <Text className="text-white font-bold">Resolve Job</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                    {isTech ? "Job Queue" : "My Tickets"}
                </Text>
                <View className="flex-row">
                    {/* PLAN CHANGE BUTTON (Customers Only) */}
                    {!isTech && (
                        <TouchableOpacity
                            onPress={() => router.push('/change_plan')}
                            className="bg-indigo-600 px-3 py-2 rounded-lg mr-2"
                        >
                            <Text className="text-white font-bold">⬆️ Upgrade</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                        <Text className="text-white font-bold">+ New</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={cases}
                    renderItem={renderItem}
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
