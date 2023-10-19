<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import TwoDimensionalExperienceGame from "@/Components/TwoDimensionalExperienceGame.vue";
import ThreeDimensionalRaceGame from "@/Components/ThreeDimensionalRaceGame.vue";
import ArExperienceGame from "@/Components/ArExperienceGame.vue";
import {useI18n} from "vue-i18n";

//Define options
defineOptions({
    layout: AppLayout,
});

//Define props
const props = defineProps({
    game: Object,
});

//Define variables
const components = {
    '2d-experience-game': TwoDimensionalExperienceGame,
    '3d-race-game': ThreeDimensionalRaceGame,
    'ar-experience-game': ArExperienceGame,
};

//Set translations variable
const {t} = useI18n({});
</script>

<template>
    <Component
        v-if="game"
        :data="game"
        :is="components[game.type.slug]"
    />

    <p
        v-else
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-red-500"
    >
        {{ t('global.no_active_game') }}
    </p>
</template>
