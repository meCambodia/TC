import { View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import API, { setBaseUrl, BASE_URL } from '../lib/api';

const Logo = () => (
    <View className="items-center justify-center mb-6">
        <Image
            source={require('../assets/logo.png')}
            style={{ width: 200, height: 80 }}
            resizeMode="contain"
        />
        {/* Text removed since logo usually contains the name, or we keep it if logo is just icon */}
        {/* <Text className="text-xl font-bold text-blue-600 mt-2">TELECOM CAMBODIA</Text> */}
    </View>
);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('Administrator'); // Default to Admin for testing
    const [password, setPassword] = useState('');
    const [serverUrl, setServerUrl] = useState(BASE_URL);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!serverUrl) {
            Alert.alert("Error", "Please enter Server URL");
            return;
        }

        setLoading(true);
        try {
            // 1. Update the API target
            setBaseUrl(serverUrl);

            // 2. Perform Login
            await API.login(email, password);

            // 3. Navigate
            router.replace('/(tabs)/cases');
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center px-6">
            <Logo />

            {/* Server URL Input */}
            <View className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                <Text className="text-gray-400 text-xs mb-1 uppercase">Frappe Server URL</Text>
                <TextInput
                    className="text-black font-medium"
                    value={serverUrl}
                    onChangeText={setServerUrl}
                    placeholder="https://your-site.frappe.cloud"
                    autoCapitalize="none"
                />
            </View>

            <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-gray-500 mb-1 text-xs">Username / Email</Text>
                <TextInput
                    className="text-black text-base"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            <View className="bg-gray-100 p-4 rounded-lg mb-8">
                <Text className="text-gray-500 mb-1 text-xs">Password</Text>
                <TextInput
                    className="text-black text-base"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-600 p-4 rounded-lg items-center shadow-lg"
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-lg">Login</Text>
                )}
            </TouchableOpacity>

            <Text className="text-center text-gray-400 mt-6 text-xs">
                Version 1.0.0 (Expo SDK 54)
            </Text>
        </View>
    );
}
