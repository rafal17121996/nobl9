<template>
  <div class="p-4 sm:p-8 text-center pt-20 sm:pt-20 bg-white dark:bg-gray-800 shadow-lg">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8">Quiz Summary</h2>
    
    <p class="text-xl text-gray-700 dark:text-gray-300 mb-4">
      Your quiz time: <span class="font-bold">{{ quizStore.formattedElapsedTime }}</span>
    </p>
    
    <Chart :correctAnswers="correctAnswers" :incorrectAnswers="incorrectAnswers" :unansweredQuestions="unansweredQuestions" />

    <QuestionsAndAnswers :questions="quizStore.questions" :answers="Object.values(quizStore.answers)" />

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

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const unansweredQuestions = ref(0);

onMounted(() => {
  if (!quizStore.isFinished) {
    router.push("/");
  }

  correctAnswers.value = Object.values(quizStore.answers).filter(answer => answer && quizStore.questions.find(q => q.correct_answer.toLowerCase() === answer.toLowerCase())).length;
  incorrectAnswers.value = Object.values(quizStore.answers).filter(answer => answer && !quizStore.questions.find(q => q.correct_answer.toLowerCase() === answer.toLowerCase())).length;
  unansweredQuestions.value = quizStore.questions.length - (correctAnswers.value + incorrectAnswers.value);
});
</script>
