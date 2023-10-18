<script setup>
import {Head} from "@inertiajs/vue3";
import {useI18n} from "vue-i18n";

//Define props
const props = defineProps({
    data: Object,
});

//Set translations variable
const {t} = useI18n({});
</script>

<template>
    <Head
        :title="t('games.ar_experience_game.meta.title')"
        :description="t('games.ar_experience_game.meta.description')"
    />

    <div class="flex justify-center items-center h-full w-full">
        <h1 class="text-4xl font-bold">{{ data.name }}</h1>
    </div>
</template>
