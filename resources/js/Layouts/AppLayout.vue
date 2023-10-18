<script setup>
import Navigation from "@/Components/Navigation.vue";
import Footer from "@/Components/Footer.vue";
import {nextTick} from "vue";

nextTick(() => {
    //Remove data props
    document.getElementById('app').removeAttribute('data-page');
});
</script>

<template>
    <Navigation/>

    <main class="relative h-screen w-screen overflow-hidden">
        <slot />
    </main>

    <Footer/>
</template>
