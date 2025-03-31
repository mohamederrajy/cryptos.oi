/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        'node_modules/preline/dist/*.js',
    ],
    theme: {
        extend: {
            scale: {
                '98': '0.98',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('preline/plugin.js'),
    ],
}
