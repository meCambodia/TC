import { Platform } from 'react-native';

// Default placeholder (updated dynamically)
export let BASE_URL = "https://control-plane.frappe.cloud";
let sessionCookie = null; // Store session ID

export const setBaseUrl = (url) => {
    let cleanUrl = url.trim();
    // Auto-add protocol if missing
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
    }
    // Remove trailing slash
    BASE_URL = cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
    console.log("API Target Set to:", BASE_URL);
};

class API {
    static async login(email, password) {
        console.log(`Logging in to: ${BASE_URL}/api/method/login`);

        // Timeout request after 10 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(`${BASE_URL}/api/method/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usr: email, pwd: password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            // CAPTURE COOKIE (Fixes Auth Persistence in Expo Go)
            const rawCookie = response.headers.get("set-cookie");
            if (rawCookie) {
                sessionCookie = rawCookie.split(';')[0]; // Simple grab
                console.log("Session Cookie Captured:", sessionCookie);
            }

            // Check if server returned HTML (often means 404 or Auth Page)
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                const text = await response.text();
                // console.log("Login Error (Non-JSON):", text.substring(0, 100)); // Be quiet
                throw new Error("Server returned HTML instead of JSON. Check your URL.");
            }

            const data = await response.json();
            if (data.message === 'Logged In') return true;
            throw new Error(data.message || 'Login Failed');

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error("Connection timed out (10s). Check your URL and Internet.");
            }
            throw error;
        }
    }

    static async getUserDetails() {
        const headers = {};
        if (sessionCookie) headers['Cookie'] = sessionCookie;
        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.get_user_details`, { headers });
        const data = await response.json();
        return data.message || {};
    }

    static async updateStatus(caseId, status) {
        const headers = { 'Content-Type': 'application/json' };
        if (sessionCookie) headers['Cookie'] = sessionCookie;
        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.update_status`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ case_id: caseId, status })
        });
        return response.json();
    }

    static async getDashboardStats() {
        const headers = {};
        if (sessionCookie) headers['Cookie'] = sessionCookie;
        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.get_dashboard_stats`, { headers });
        const data = await response.json();
        return data.message || { open: 0, working: 0, done: 0, critical: 0, breached: 0 };
    }

    static async getMyCases() {
        console.log(`Fetching cases from: ${BASE_URL}/api/method/tc_system.api.get_my_cases`);
        try {
            const headers = {};
            if (sessionCookie) headers['Cookie'] = sessionCookie;

            const response = await fetch(`${BASE_URL}/api/method/tc_system.api.get_my_cases`, {
                method: 'GET',
                headers: headers
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                console.log("GetCases Error: Server returned HTML. Likely 404 or Auth Redirect.");
                // Return empty instead of crashing
                return [];
            }

            const data = await response.json();
            return data.message || [];
        } catch (error) {
            console.log("GetCases Error:", error);
            return [];
        }
    }

    static async createCase(subject, description) {
        const headers = { 'Content-Type': 'application/json' };
        if (sessionCookie) headers['Cookie'] = sessionCookie;

        const response = await fetch(`${BASE_URL}/api/method/tc_system.api.create_case`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ subject, description })
        });
        return response.json();
    }
}

export default API;
