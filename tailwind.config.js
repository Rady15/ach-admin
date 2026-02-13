/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#256af4",
                "primary-dark": "#1e56c8",
                "primary-glow": "#3b82f6",
                "primary-light": "#4f8ff7",

                // Dark mode backgrounds
                "background-dark": "#0B0E14",
                "background-card-dark": "#1e293b",

                // Light mode backgrounds
                "background-light": "#f8fafc",
                "background-card-light": "#ffffff",

                // Dynamic backgrounds (CSS variables)
                "background-card": "var(--bg-card)",
                "background-main": "var(--bg-main)",

                // Glass effects
                "glass-surface": "rgba(30, 41, 59, 0.4)",
                "glass-border": "var(--glass-border)",
                "glass-border-dark": "rgba(255, 255, 255, 0.08)",
                "glass-border-light": "rgba(0, 0, 0, 0.08)",

                // Accent colors
                "neon-purple": "#a855f7",
                "neon-cyan": "#06b6d4",
                "success": "#10b981",
                "success-dark": "#059669",
                "warning": "#f59e0b",
                "warning-dark": "#d97706",
                "danger": "#ef4444",
                "danger-dark": "#dc2626",
                "info": "#3b82f6",
                "info-dark": "#2563eb",

                // Text colors
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-muted": "var(--text-muted)",
            },
            fontFamily: {
                "display": ["Tajawal", "Space Grotesk", "sans-serif"],
                "body": ["Tajawal", "sans-serif"],
                "mono": ["Space Grotesk", "monospace"],
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glass-gradient-light': 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                'glow-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glass-light': '0 4px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)',
                'glow': '0 0 20px rgba(37, 106, 244, 0.3)',
                'glow-light': '0 0 20px rgba(37, 106, 244, 0.15)',
                'card-light': '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 30px -5px rgba(0, 0, 0, 0.08)',
            },
        },
    },
    plugins: [],
}
