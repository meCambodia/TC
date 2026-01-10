# Telecom Cambodia Mobile App

This project is a React Native (Expo) application for:
- Field Sales Agents (Customer onboarding, SIM sales)
- Customers (Self-service, Plan management, Support)

## Tech Stack
- **Framework**: React Native (Expo SDK 50+)
- **Navigation**: Expo Router (v3)
- **UI**: NativeWind (TailwindCSS for React Native)
- **Huawei Support**: HMS Core Config Plugins (via `config-plugins/react-native-hms-push`)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally (Simulators)**:
    ```bash
    npx expo start
    ```
    - Press `i` for iOS Simulator
    - Press `a` for Android Emulator

3.  **Build for Production**:
    - **Android (APK/AAB)**: `eas build -p android`
    - **iOS (IPA)**: `eas build -p ios`
    - **Huawei (APK)**: `eas build -p android --profile huawei` (requires specific build profile)

## Project Structure
- `app/` - Screens and navigation (Expo Router)
- `components/` - Reusable UI components
- `lib/` - API client (connects to TCSystem backend)
- `assets/` - Images and fonts

## Connecting to Backend
Update `lib/api.ts` with your Frappe Cloud URL:
```typescript
const BASE_URL = "https://control-plane.frappe.cloud"; // Replace with your actual site URL
```
