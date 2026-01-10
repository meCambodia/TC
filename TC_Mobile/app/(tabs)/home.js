import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="bg-blue-600 p-6 pt-12 rounded-b-3xl shadow-xl">
                <Text className="text-white text-2xl font-bold">Hello, Customer!</Text>
                <Text className="text-blue-100 mt-2">Welcome to Telecom Cambodia</Text>
            </View>

            <View className="p-6">
                <Text className="text-lg font-bold mb-4 text-gray-800">Quick Actions</Text>

                <View className="flex-row gap-4 mb-4">
                    <TouchableOpacity className="flex-1 bg-white p-5 rounded-xl shadow-sm items-center">
                        <Text className="text-3xl mb-2">📡</Text>
                        <Text className="font-medium text-gray-700">New Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-white p-5 rounded-xl shadow-sm items-center">
                        <Text className="text-3xl mb-2">💳</Text>
                        <Text className="font-medium text-gray-700">Pay Bill</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-4">
                    <TouchableOpacity className="flex-1 bg-white p-5 rounded-xl shadow-sm items-center">
                        <Text className="text-3xl mb-2">🔧</Text>
                        <Text className="font-medium text-gray-700">Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-white p-5 rounded-xl shadow-sm items-center">
                        <Text className="text-3xl mb-2">👤</Text>
                        <Text className="font-medium text-gray-700">Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="p-6 pt-0">
                <Text className="text-lg font-bold mb-4 text-gray-800">Latest Promotions</Text>
                <View className="bg-orange-100 p-4 rounded-xl border border-orange-200">
                    <Text className="text-orange-800 font-bold">50% OFF Fiber Installation!</Text>
                    <Text className="text-orange-600 text-sm mt-1">Valid until Jan 31st. Upgrade your speed today.</Text>
                </View>
            </View>
        </ScrollView>
    );
}
