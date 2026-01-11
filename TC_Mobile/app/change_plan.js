import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'expo-router';

export default function ChangePlanScreen() {
    const router = useRouter();
    const [currentPlan, setCurrentPlan] = useState('Tier A'); // Default or fetch
    const [requestedPlan, setRequestedPlan] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!requestedPlan) {
            Alert.alert("Error", "Please enter a requested plan (e.g., Tier B)");
            return;
        }

        setSubmitting(true);
        try {
            const result = await API.createSubscriptionRequest(currentPlan, requestedPlan, reason);
            Alert.alert("Success", "Request sent to Sales Team for approval!");
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to submit request.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Change Subscription</Text>

            <View className="mb-4">
                <Text className="text-gray-500 mb-1">Current Plan</Text>
                <TextInput
                    value={currentPlan}
                    onChangeText={setCurrentPlan}
                    className="bg-gray-100 p-4 rounded-xl text-gray-500"
                    editable={true} // Allow manual edit for now
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-500 mb-1">Requested Plan</Text>
                <TextInput
                    value={requestedPlan}
                    onChangeText={setRequestedPlan}
                    placeholder="e.g. Tier B (50Mbps)"
                    className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-gray-800 font-bold"
                    autoFocus
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-500 mb-1">Reason for Change</Text>
                <TextInput
                    value={reason}
                    onChangeText={setReason}
                    placeholder="I need faster speed for work..."
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-24"
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                className={`p-4 rounded-xl items-center ${submitting ? 'bg-gray-400' : 'bg-blue-600'}`}
            >
                {submitting ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Submit Request</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
                className="mt-4 p-4 items-center"
            >
                <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}
