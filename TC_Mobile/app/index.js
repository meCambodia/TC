import { Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import API from '../lib/api';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverUrl, setServerUrl] = useState('telecomcambodia.frappe.cloud'); // Default
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            // Set dynamic base URL
            let url = serverUrl.trim();
            if (!url.startsWith('http')) url = `https://${url}`;
            API.setBaseUrl(url);

            const result = await API.login(email, password);
            console.log("Login Result:", result);

            // 3. Navigate
            router.replace('/(tabs)/cases');
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/angkor_bg.png')}
            className="flex-1 justify-center"
            resizeMode="cover"
        >
            {/* Dark Overlay */}
            <View className="flex-1 bg-black/40 justify-center p-6">

                {/* Login Card */}
                <View className="bg-white/95 p-6 rounded-2xl shadow-xl">
                    <View className="items-center mb-8">
                        <Image source={require('../assets/icon.png')} className="w-20 h-20 mb-4" />
                        <Text className="text-2xl font-bold text-blue-900">Telecom Cambodia</Text>
                        <Text className="text-gray-500 text-xs">Mobile Control Plane</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-600 mb-1 ml-1 text-xs font-bold">SERVER URL</Text>
                            <TextInput
                                className="bg-gray-100 p-4 rounded-xl text-gray-800"
                                placeholder="telecomcambodia.frappe.cloud"
                                value={serverUrl}
                                onChangeText={setServerUrl}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-600 mb-1 ml-1 text-xs font-bold">EMAIL / USERNAME</Text>
                            <TextInput
                                className="bg-gray-100 p-4 rounded-xl text-gray-800"
                                placeholder="name@telecomcambodia.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-600 mb-1 ml-1 text-xs font-bold">PASSWORD</Text>
                            <TextInput
                                className="bg-gray-100 p-4 rounded-xl text-gray-800"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-blue-900 py-4 rounded-xl items-center mt-4 shadow-lg active:scale-95"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <Text className="text-white/60 text-center mt-8 text-xs">
                    "Connecting Cambodia to the Future"
                </Text>
            </View>
        </ImageBackground>
    );
}
