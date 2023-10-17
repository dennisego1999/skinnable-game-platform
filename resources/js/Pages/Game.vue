<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";

//Define options
defineOptions({
    layout: AppLayout,
});

//Define props
const props = defineProps({
    game: Object,
});
</script>

<template>
    <h1>Welcome to the game!</h1>

    <pre>{{ game }}</pre>
</template>
