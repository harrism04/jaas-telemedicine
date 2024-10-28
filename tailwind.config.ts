import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Update primary color to match #0056E0
        primary: {
          DEFAULT: '#0056E0', // Changed from #1976D2 to #0056E0
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5F5', // Light Gray
          foreground: '#2D3748',
        },
        accent: {
          DEFAULT: '#4CAF50', // Green for success/join buttons
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#2D3748',
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
