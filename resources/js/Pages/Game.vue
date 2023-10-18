<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import TwoDimensionalExperienceGame from "@/Components/TwoDimensionalExperienceGame.vue";
import ThreeDimensionalExperienceGame from "@/Components/ThreeDimensionalExperienceGame.vue";
import ArExperienceGame from "@/Components/ArExperienceGame.vue";

//Define options
defineOptions({
    layout: AppLayout,
});

//Define props
const props = defineProps({
    game: Object,
});

//Define variables
const components = [
    {
        type: '2d-experience-game',
        component: TwoDimensionalExperienceGame
    },
    {
        type: '3d-experience-game',
        component: ThreeDimensionalExperienceGame
    },
    {
        type: 'ar-experience-game',
        component: ArExperienceGame
    },
];
const currentComponent = components.find(component => component.type === props.game.type.slug)
</script>

<template>
    <component :is="currentComponent.component"/>
</template>
