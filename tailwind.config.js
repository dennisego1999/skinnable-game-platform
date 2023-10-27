import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './app/Filament/**/*.php',
        './resources/views/filament/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            colors: {
                global: {
                    blue: {
                        100: 'rgb(111, 163, 240)',
                    }
                }
            },
            animation: {
                'loader-bar-1': 'loader-bar 1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite',
                'loader-bar-2': 'loader-bar 1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 200ms infinite',
                'loader-bar-3': 'loader-bar 1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 400ms infinite',
            },
            keyframes: {
                'loader-bar': {
                    '0%': {
                        height: '80px',
                        backgroundColor: 'rgb(111, 163, 240)',
                    },
                    '20%': {
                        height: '80px',
                    },
                    '40%': {
                        height: '120px',
                        backgroundColor: 'rgb(111, 200, 240)',
                    },
                    '80%': {
                        height: '80px',
                    },
                    '100%': {
                        height: '80px',
                        backgroundColor: 'rgb(111, 163, 240)',
                    },
                }
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms, typography],
};
