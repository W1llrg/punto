// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
    devtools: { enabled: true },
    serverMiddleware: [
        { path: '/api', handler: '~/server/index.js' },
    ],
    css: ['~/assets/css/main.scss'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
};
