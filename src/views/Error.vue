<template>
  <div class="flex-grow flex flex-col items-center justify-center error-page p-12 text-center bg-white dark:bg-gray-800 transition-colors duration-300">
    <h1 class="text-red-600 dark:text-red-400 text-4xl font-bold mb-6">Error</h1>
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{{ errorMessage }}</p>
    <router-link
      to="/"
      class="inline-block mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition-colors duration-300"
    >
      Go Back to Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMessage = route.query.message || 'An unexpected error occurred.';

</script>
