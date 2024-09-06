<template>
<nav class="p-4 fixed top-0 left-0 w-full shadow-md z-50 bg-green-500 text-gray-100 dark:bg-gray-900 dark:text-green-500">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <span class="text-2xl font-bold">Quiz App</span>
      </router-link>

      <button @click="toggleDarkMode" class="text-gray-900 dark:text-gray-100">
        <span v-if="isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style scoped>
.dark .bg-green-500 {
  background-color: #161616; 
}

.dark .text-white {
  color: #e0e0e0;
}

.dark .shadow-md {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}
</style>