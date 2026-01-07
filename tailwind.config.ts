import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Premium "Modern Excellence" Palette
                primary: {
                    DEFAULT: '#0F172A', // Slate 900 (Deep Background)
                    light: '#1E293B',   // Slate 800 (Card Background)
                    dark: '#020617',    // Slate 950 (Contrast)
                },
                accent: {
                    DEFAULT: '#6366F1', // Indigo 500 (Vibrant Brand Color)
                    hover: '#4F46E5',   // Indigo 600
                    glow: '#818CF8',    // Indigo 400
                },
                secondary: {
                    DEFAULT: '#EC4899', // Pink 500 (Modern Gradient Accent)
                    dark: '#BE185D',    // Pink 700
                },
                highlight: {
                    DEFAULT: '#F59E0B', // Amber 500 (Golden Touch)
                    light: '#FCD34D',   // Amber 300
                },
                surface: {
                    white: '#FFFFFF',
                    off: '#F8FAFC',     // Slate 50
                    glass: 'rgba(255, 255, 255, 0.1)',
                    darkGlass: 'rgba(15, 23, 42, 0.6)',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
                baskerville: ['var(--font-libre-baskerville)', 'serif'],
            },
            backgroundImage: {
                'gradient-mesh': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
                'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'gradient-glow': 'conic-gradient(from 180deg at 50% 50%, #6366F1 0deg, #EC4899 180deg, #6366F1 360deg)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'shine': 'shine 3s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shine: {
                    '0%': { backgroundPosition: '200% center' },
                    '100%': { backgroundPosition: '-200% center' },
                },
            },
            boxShadow: {
                'glow': '0 0 50px -12px rgba(99, 102, 241, 0.5)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }
        },
    },
    plugins: [],
};

export default config;
