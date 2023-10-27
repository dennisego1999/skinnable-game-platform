<script setup>
import {Head} from "@inertiajs/vue3";
import {useI18n} from "vue-i18n";
import {Game} from "@/Classes/SpaceInvaderGame/Game.js";
import {nextTick, onBeforeUnmount} from "vue";

//Define props
const props = defineProps({
    data: Object,
});

//Set translations variable
const {t} = useI18n({});

//Set variables
let game;

nextTick(() => {
    //Create new game
    game = new Game('game-canvas');

    //Add event listener
    window.addEventListener('resize', () => game.resize.call(game));
});

onBeforeUnmount(() => {
    //Remove event listener
    window.removeEventListener('resize', () => game.resize.call(game));
});
</script>

<template>
    <Head
        :title="t('games.space_invader_game.meta.title')"
        :description="t('games.space_invader_game.meta.description')"
    />

    <canvas id="game-canvas" class="cursor-grab h-full w-full focus-visible:outline-transparent"></canvas>
</template>
