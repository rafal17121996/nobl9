<template>
  <div class="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 sm:p-6">
    <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-green-500 mb-6 sm:mb-8 text-center">
      Welcome to the Trivia Quiz
    </h1>
    <QuizSetup class="w-full max-w-xs sm:max-w-md" />
  </div>
</template>

<script setup lang="ts">
import QuizSetup from '../components/QuizSetup.vue';
</script>