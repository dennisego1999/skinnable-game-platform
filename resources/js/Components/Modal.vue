<script setup>
//Define emits
const emit = defineEmits(['close']);

//Define props
defineProps({
  show: Boolean
});
</script>

<template>
    <transition name="fade" mode="out-in">
      <div
          v-if="show"
          id="popup-modal-container"
          class="fixed z-50 inset-0 h-full w-full flex justify-center items-center px-[22px] transition-all"
      >
        <div class="relative z-50 flex flex-col gap-4 w-full max-w-lg px-4 cursor-default bg-white p-4 rounded drop-shadow-lg">
          <slot/>
        </div>

        <transition name="fade" mode="out-in">
          <div
              class="absolute z-40 inset-0 w-full h-full flex justify-center items-center cursor-pointer bg-black/30"
              @click="emit('close')"
          ></div>
        </transition>
      </div>
    </transition>
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
