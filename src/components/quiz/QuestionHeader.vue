<template>
  <h2
    class="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2 sm:pb-4 dark:text-gray-200"
  >
    Question {{ currentIndex + 1 }} / {{ totalQuestions }}
  </h2>
</template>

<script setup lang="ts">
const props = defineProps({
  currentIndex: {
    type: Number,
    required: true,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 1,
  },
});
</script>
