<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import SpaceInvaderGame from "@/Components/SpaceInvaderGame.vue";
import EarthNavigationGame from "@/Components/EarthNavigationGame.vue";
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
    'space-invader-game': SpaceInvaderGame,
    'earth-navigation-game': EarthNavigationGame,
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
