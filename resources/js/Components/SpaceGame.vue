<script setup>
import {Head} from "@inertiajs/vue3";
import {useI18n} from "vue-i18n";
import {onBeforeUnmount, ref} from "vue";
import SpaceGame from "@/Classes/SpaceGame.js";

//Define props
const props = defineProps({
    data: Object,
});

//Set translations variable
const {t} = useI18n({});

//Set variables
let game = null;
const hasStarted = ref(false);

//Set functions
function startGame() {
    //Set reactive
    hasStarted.value = true;

    //Init race game class
    game = new SpaceGame('race-canvas');

    //Add event listener
    window.addEventListener('resize', () => game.resize());
}

onBeforeUnmount(() => {
    //Remove event listener
    window.removeEventListener('resize', () => game.resize());
});
</script>

<template>
    <Head
        :title="t('games.3d_experience_game.meta.title')"
        :description="t('games.3d_experience_game.meta.description')"
    />

    <transition name="fade" mode="out-in">
        <div v-if="!hasStarted" class="flex flex-col justify-center items-center gap-4 h-full w-full">
            <h1 class="text-2xl font-bold">{{ data.name }}</h1>

            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="startGame">
                {{ t('games.buttons.start') }}
            </button>
        </div>
    </transition>

    <canvas
        id="race-canvas"
        class="h-screen w-screen transition-opacity duration-500"
        :class="{'opacity-0': !hasStarted}"
    ></canvas>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
