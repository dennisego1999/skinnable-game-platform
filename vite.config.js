import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default ({ mode }) => {
    // Read the environment file
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const host = process.env.VITE_TLS_URL;
    const isDDEV = process.env.VITE_PROJECT_DIR;
    const server = !isDDEV ? null : {
        hmr: {
            protocol: "wss",
            host,
        },
    };
    const valetTls = isDDEV ? null : host;

    return defineConfig({
        plugins: [
            laravel({
                input: 'resources/js/app.js',
                ssr: 'resources/js/ssr.js',
                refresh: true,
                valetTls,
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            })
        ],
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
        server,
    });
};
