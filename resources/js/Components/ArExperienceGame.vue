<script setup>
import {Head} from "@inertiajs/vue3";
import {useI18n} from "vue-i18n";

//Define props
const props = defineProps({

});

//Set translations variable
const {t} = useI18n({});
</script>

<template>
    <Head
        :title="t('games.ar_experience_game.meta.title')"
        :description="t('games.ar_experience_game.meta.description')"
    />

    <h1>Welcome to the AR experience game!</h1>
</template>
