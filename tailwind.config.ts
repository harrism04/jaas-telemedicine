import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: '#F5F5F5', // Light Gray
          foreground: '#2D3748',
        },
        accent: {
          DEFAULT: '#4CAF50', // Green for success/join buttons
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F7FAFC',
          foreground: '#4A5568',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D3748',
        },
        border: '#E2E8F0',
        destructive: {
          DEFAULT: "#EF4444", // Red color
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'custom': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
