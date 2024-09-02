<template>
  <div class="max-w-md mx-auto text-center p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-6">Set up your quiz</h2>
    
    <div class="mb-4">
      <label for="difficulty" class="block text-left font-medium text-gray-700 mb-2">Difficulty:</label>
      <select id="difficulty" v-model="selectedDifficulty" class="w-full p-2 border border-gray-300 rounded">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <div class="mb-6">
      <label for="amount" class="block text-left font-medium text-gray-700 mb-2">
        Number of questions: <span class="font-bold">{{ selectedAmount }}</span>
      </label>
      <input
        type="range"
        id="amount"
        v-model="selectedAmount"
        min="5"
        max="20"
        class="w-full"
      />
    </div>

    <button @click="startQuiz" class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
      Start Quiz
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';

const router = useRouter();
const quizStore = useQuizStore();

const selectedDifficulty = ref<string>('easy'); 
const selectedAmount = ref<number>(10); 

const startQuiz = () => {
  quizStore.fetchQuestions(selectedAmount.value, selectedDifficulty.value);
  router.push('/quiz');
};
</script>
