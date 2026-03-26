# Agri-Rent: Agricultural Equipment Rental Platform

Agri-Rent is a location-aware web application designed to seamlessly connect farmers with agricultural machinery owners. The platform allows owners to list their underutilized equipment (like tractors, harvesters, etc.), while enabling local farmers to search, locate, and book this machinery using interactive maps.

Below is a complete explanation of the programming languages, tools, frameworks, and APIs powering the Agri-Rent platform.

## 🚀 Languages and Core Technologies

1. **JavaScript (ES6+) / JSX**
   - The entire front-end logic, state management, and component rendering are written in JavaScript utilizing JSX (React's syntax extension). This ensures a component-driven architecture that is easy to scale, maintain, and understand.
   
2. **HTML5**
   - Provides the foundational semantic structure for the web application. Features like the Geolocation API natively tap into modern HTML capabilities.
   
3. **CSS3 (Vanilla CSS)**
   - Used for the entire styling and responsive design of the application. The project relies on custom-defined CSS variables (`var(--color-primary)`, `--color-gray`) to enforce a consistent theme (green and clean agricultural aesthetics) without relying on heavy frontend CSS frameworks.

## 🛠️ Frameworks and Libraries

- **React.js (v18+)**: The core frontend framework orchestrating the user interface. It utilizes the React Context API heavily to handle global state like Authentication (`useAuth`) and Database functionality (`useData`).
- **Vite**: The next-generation frontend tooling responsible for lightning-fast Hot Module Replacement (HMR) during development and highly optimized production builds.
- **React Router (v6)**: Handles client-side routing, enabling seamless navigation between `Home`, `SellerDashboard`, `BuyerDashboard`, `AdminDashboard`, `Profile`, and `About` without triggering hard page reloads.
- **Leaflet & React-Leaflet**: Open-source JavaScript libraries used to render interactive, mobile-friendly maps on the Buyer Dashboard, allowing farmers to visually spot equipment nearby.
- **Lucide React**: A lightweight icon library utilized throughout the interface to render responsive SVG icons (e.g., the chat bubble, microphone icons, modal close buttons).

## 🌍 External APIs Explained

### 1. Gemini Open AI API (Google Generative AI)
- **Where it is used:** `src/components/ChatBot.jsx`
- **Purpose:** Powers the "Agri-Rent AI Assistant" chatbot floating in the bottom-right corner.
- **How it works:** When a user types a question or speaks into the microphone regarding agricultural rentals, the query is dispatched securely via a `POST` request to `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`. The AI acts as a smart farming assistant, analyzing the prompt and returning an instant, concise answer to guide the user.

### 2. Nominatim OpenStreetMap API (Reverse Geocoding)
- **Where it is used:** `src/pages/BuyerDashboard.jsx`
- **Purpose:** Converts geographical map coordinates (Latitude & Longitude) into human-readable city or village names.
- **How it works:** When a buyer clicks anywhere on the Leaflet map to search for equipment in a specific territory, the app intercepts the coordinates (`e.latlng`) and performs a `GET` request to `https://nominatim.openstreetmap.org/reverse`. It extracts the city, town, or village name from the response and populates the platform's location search filter automatically.

### 3. HTML5 Web Speech API (Speech Recognition)
- **Where it is used:** `src/components/ChatBot.jsx`
- **Purpose:** Provides voice-to-text capabilities inside the AI Chatbot.
- **How it works:** Uses `window.SpeechRecognition` native to modern web browsers. When the user holds the microphone icon, their spoken audio is instantly transcribed into textual queries that are then fed to the Gemini AI API.

### 4. HTML5 Geolocation API
- **Where it is used:** `src/pages/BuyerDashboard.jsx`
- **Purpose:** Centers the map directly on the user's current physical location.
- **How it works:** Relies on the browser navigator capability (`navigator.geolocation.getCurrentPosition`). By clicking "Show Nearby (Use My GPS)", the browser requests location permissions. Once granted, it captures the user's exact latitude and longitude, shifting the map viewport to instantly display tractors or equipment in their direct proximity.

## 💾 Local Storage (Mock Database)
- Instead of using a traditional backend server API (like Node/Express + MongoDB), Agri-Rent is currently driven by a highly persistent and complex mock database.
- Global state for user accounts, equipment listings, bookings, and notifications is dynamically serialized via `JSON.stringify` and saved into the browser's native `window.localStorage` (using keys like `agrirent_users`, `agrirent_equipments`, `agrirent_bookings`). This guarantees that data perfectly persists evenly after browser refreshes, effectively mimicking a live API.
