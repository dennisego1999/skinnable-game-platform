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
        :title="t('games.3d_experience_game.meta.title')"
        :description="t('games.3d_experience_game.meta.description')"
    />

    <h1>Welcome to the 3D experience game!</h1>
</template>
