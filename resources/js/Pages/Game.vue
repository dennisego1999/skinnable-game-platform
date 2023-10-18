<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import TwoDimensionalExperienceGame from "@/Components/TwoDimensionalExperienceGame.vue";
import ThreeDimensionalExperienceGame from "@/Components/ThreeDimensionalExperienceGame.vue";
import ArExperienceGame from "@/Components/ArExperienceGame.vue";
import {Head} from "@inertiajs/vue3";

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
    '3d-experience-game': ThreeDimensionalExperienceGame,
    'ar-experience-game': ArExperienceGame,
};
</script>

<template>
    <Head
        :title="'Game'"
        description="'The description'"
    />

    <Component :is="components[game.type.slug]"/>
</template>
