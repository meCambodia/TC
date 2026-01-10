import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import API from '../../lib/api';
import { useRouter } from 'expo-router';

const StatCard = ({ label, value, color, icon }) => (
    <View className={`w-[48%] bg-white p-4 rounded-xl mb-4 shadow-sm border-l-4 ${color}`}>
        <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</Text>
        <Text className="text-3xl font-extrabold text-gray-800 mt-2">{value}</Text>
    </View>
);

export default function DashboardScreen() {
    const [stats, setStats] = useState({ open: 0, working: 0, done: 0, critical: 0, breached: 0 });
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchStats = async () => {
        try {
            const data = await API.getDashboardStats();
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50 p-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-2xl font-bold text-gray-800">Ops Command</Text>
                    <Text className="text-xs text-gray-500">Live Situation Report</Text>
                </View>
                {/* Logout or Settings could go here */}
            </View>

            {/* CRITICAL ALERTS */}
            {stats.critical > 0 && (
                <View className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 flex-row items-center">
                    <Text className="text-2xl mr-3">🚨</Text>
                    <View>
                        <Text className="text-red-800 font-bold text-lg">{stats.critical} Critical Incidents</Text>
                        <Text className="text-red-600 text-xs">Immediate attention required</Text>
                    </View>
                </View>
            )}

            {/* SLA BREACHES */}
            {stats.breached > 0 && (
                <View className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 flex-row items-center">
                    <Text className="text-2xl mr-3">⏱️</Text>
                    <View>
                        <Text className="text-orange-800 font-bold text-lg">{stats.breached} SLA Breaches</Text>
                        <Text className="text-orange-600 text-xs">Targets missed</Text>
                    </View>
                </View>
            )}

            {/* KEY METRICS GRID */}
            <View className="flex-row flex-wrap justify-between">
                <StatCard label="Open Tickets" value={stats.open} color="border-blue-500" />
                <StatCard label="In Progress" value={stats.working} color="border-yellow-500" />
                <StatCard label="Resolved" value={stats.done} color="border-green-500" />
                <StatCard label="Total Flow" value={Object.values(stats).reduce((a, b) => a + b, 0)} color="border-gray-500" />
            </View>

            {/* NAVIGATION SHORTCUTS */}
            <TouchableOpacity
                onPress={() => router.push('/(tabs)/cases')}
                className="bg-white p-4 rounded-xl mt-2 flex-row justify-between items-center shadow-sm"
            >
                <Text className="font-bold text-gray-700">Go to Job Queue</Text>
                <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}
