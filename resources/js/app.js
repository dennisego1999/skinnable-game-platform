import './bootstrap';
import '../sass/app.scss';

console.log('lol');

import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n'
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        //Get locale
        const initialPage = props.initialPage;
        const locale = initialPage.props.locale;

        //Load translations
        const messages = {};
        messages[locale] = initialPage.props.translations;

        //Create the i18N instance
        const i18n = createI18n({
            locale: locale, // set locale
            fallbackLocale: locale, // set fallback locale
            messages,
            warnHtmlInMessage: 'off', // This should disable the warning in browser console.
        });

        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(i18n)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
