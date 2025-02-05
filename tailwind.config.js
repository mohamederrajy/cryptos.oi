/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                'body': ['Inter', 'sans-serif'],
            },
            colors: {
                'primary': '#605bff',
                'gray': {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                }
            }
        },
    },
    plugins: [],
}
