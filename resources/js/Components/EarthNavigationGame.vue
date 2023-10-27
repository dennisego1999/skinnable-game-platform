<script setup>
import {Head} from "@inertiajs/vue3";
import {useI18n} from "vue-i18n";
import {nextTick, onBeforeUnmount, ref} from "vue";
import {Game} from "@/Classes/EarthNavigationGame/Game.js";
import Modal from "@/Components/Modal.vue";
import CustomButton from "@/Components/CustomButton.vue";

//Define props
const props = defineProps({
    'data': Object,
});

//Define variables
let game;
const isModalOpen = ref(false);
const isMarkerOpen = ref(false);

//Set translations variable
const {t} = useI18n({});

//Define functions
function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function openMarkerInfo() {
    //Set reactive
    isMarkerOpen.value = true;
}

function closeMarkerInfo() {
    //Set reactive
    isMarkerOpen.value = false;

    //Reset to normal camera view
    game.resetCameraView.call(game);
}

nextTick(() => {
    //Create game instance
    game = new Game('game-canvas');

    //Add event listener
    game.addEventListeners();
    document.addEventListener('openMarkerInfo', openMarkerInfo);
    document.addEventListener('openSpaceModal', openModal);

});

onBeforeUnmount(() => {
    //Remove event listeners
    game.removeEventListeners();
    document.removeEventListener('openMarkerInfo', openMarkerInfo);
    document.removeEventListener('openSpaceModal', openModal);
});
</script>

<template>
    <Head
        :title="t('games.space_game.meta.title')"
        :description="t('games.space_game.meta.description')"
    />

    <div id="loader" class="fixed h-screen w-screen bg-white flex justify-center items-center">
        <div class="relative flex justify-center items-center gap-2 w-fit h-fit">
            <div class="w-4 h-20 m-auto rounded bg-global-blue-100 animate-loader-bar-1"></div>
            <div class="w-4 h-20 m-auto rounded bg-global-blue-100 animate-loader-bar-2"></div>
            <div class="w-4 h-20 m-auto rounded bg-global-blue-100 animate-loader-bar-3"></div>
        </div>
    </div>

    <transition name="fade">
        <custom-button
            v-if="isMarkerOpen"
            class="fixed top-4 left-4"
            @click="closeMarkerInfo"
        >
            Close
        </custom-button>
    </transition>

    <modal
        :show="isModalOpen"
        @close="closeModal"
    >
        <p class="">Welcome to the experience verse</p>

        <custom-button
            @click="closeModal"
        >
            Close
        </custom-button>
    </modal>

    <canvas id="game-canvas" class="cursor-grab h-full w-full focus-visible:outline-transparent"></canvas>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
