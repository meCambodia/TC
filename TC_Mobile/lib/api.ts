import { Platform } from 'react-native';

// TODO: Replace with your actual deployed Frappe Cloud Site URL
export const BASE_URL = "https://control-plane.frappe.cloud"; 

class API {
    static async login(email, password) {
        // Standard Frappe Login
        const response = await fetch(`${BASE_URL}/api/method/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usr: email, pwd: password })
        });
        const data = await response.json();
        if (data.message === 'Logged In') return true;
        throw new Error(data.message || 'Login Failed');
    }

    static async getMyCases() {
        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.get_my_cases`);
        const data = await response.json();
        return data.message || [];
    }

    static async createCase(subject, description) {
        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.create_case`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, description })
        });
        return response.json();
    }
}

export default API;
