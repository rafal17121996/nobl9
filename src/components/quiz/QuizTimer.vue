<template>
  <div class="text-lg text-gray-800 dark:text-gray-200">
    {{ quizStore.formattedElapsedTime }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useQuizStore } from "../../store/quiz";

const quizStore = useQuizStore();

onMounted(() => {
  quizStore.startTimer();
});

onBeforeUnmount(() => {
  quizStore.stopTimer();
});
</script>

<style scoped></style>
