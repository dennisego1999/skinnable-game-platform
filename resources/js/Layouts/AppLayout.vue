<script setup>
import {nextTick} from "vue";

nextTick(() => {
    //Remove data props
    document.getElementById('app').removeAttribute('data-page');
});
</script>

<template>
    <main class="relative min-h-[100dvh] overflow-hidden">
        <slot />
    </main>
</template>
