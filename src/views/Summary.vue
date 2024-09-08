<template>
  <div class="flex-grow p-4 sm:p-8 text-center pt-20 sm:pt-20 bg-white dark:bg-gray-800 shadow-lg">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8">Quiz Summary</h2>
    
    <p class="text-xl text-gray-700 dark:text-gray-300 mb-4">
      Your quiz time: <span class="font-bold">{{ selectedResult?.elapsedTime ? formatTime(selectedResult.elapsedTime) : quizStore.formattedElapsedTime }}</span>
    </p>

    <div class="mt-6 mb-4">
      <label for="quizResultsDropdown" class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Select a quiz result:</label>
      <select 
        id="quizResultsDropdown" 
        v-model="selectedResultIndex" 
        @change="updateSelectedResult" 
        class="ml-4 p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition"
      >
        <option v-for="(result, index) in quizResults" :key="index" :value="index">
          {{ new Date(result.date).toLocaleString() }}
        </option>
      </select>
    </div>

    <Chart :correctAnswers="selectedResult?.correctAnswers || 0" :incorrectAnswers="incorrectAnswers" :unansweredQuestions="unansweredQuestions" />


    <div class="mt-6">
      <QuestionsAndAnswers :questions="selectedResult?.questions" :answers="Object.values(selectedResult?.answers || {})" />
    </div>

    <router-link 
      to="/" 
      class="inline-block mt-10 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
    >
      Go Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import Chart from '../components/summary/Chart.vue';
import QuestionsAndAnswers from '../components/summary/QuestionsAndAnswers.vue';

const quizStore = useQuizStore();
const router = useRouter();
const quizResults = ref<any[]>([]); 
const selectedResultIndex = ref(0); 
const selectedResult = ref<any>(null); 

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const unansweredQuestions = ref(0);

onMounted(() => {
  const storedResults = localStorage.getItem('quizResults');
  if (storedResults) {
    quizResults.value = JSON.parse(storedResults);
    selectedResultIndex.value = quizResults.value.length - 1; 
    updateSelectedResult();
  }
  else {
    const errorMessage = 'No history, solve quiz to see results'
    router.push({ name: "Error", query: { message: errorMessage } });
  }
});

const updateSelectedResult = () => {
  selectedResult.value = quizResults.value[selectedResultIndex.value];

  correctAnswers.value = selectedResult.value.correctAnswers || 0;
  incorrectAnswers.value = (selectedResult.value.totalQuestions || 0) - correctAnswers.value;
  unansweredQuestions.value = 0; 
};

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
</script>
