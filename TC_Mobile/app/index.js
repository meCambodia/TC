import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const Logo = () => (
    <View className="items-center justify-center mb-10">
        <Image
            source={require('../assets/icon.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-blue-600 mt-4">TELECOM CAMBODIA</Text>
    </View>
);

export default function LoginScreen() {
    const router = useRouter();

    const handleLogin = () => {
        // In reality, call API.login() here
        // For demo, just push to tabs
        router.replace('/(tabs)/home');
    };

    return (
        <View className="flex-1 bg-white justify-center px-6">
            <Logo />

            <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-gray-500 mb-1">Email</Text>
                <Text className="text-black">demo@telecomcambodia.com</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-lg mb-8">
                <Text className="text-gray-500 mb-1">Password</Text>
                <Text className="text-black">••••••••</Text>
            </View>

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-600 p-4 rounded-lg items-center shadow-lg"
            >
                <Text className="text-white font-semibold text-lg">Login</Text>
            </TouchableOpacity>

            <Text className="text-center text-gray-400 mt-6">
                Version 1.0.0 (HMS Supported)
            </Text>
        </View>
    );
}
