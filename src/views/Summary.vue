<template>
  <div class="max-w-3xl mx-auto p-8 text-center">
    <h2 class="text-3xl font-semibold text-gray-800 mb-8">Quiz Summary</h2>
    <canvas id="quizSummaryChart" class="mb-10"></canvas>

    <h3 class="text-2xl font-semibold text-gray-700 mb-6">Questions and Answers</h3>
    <ul class="space-y-6">
      <li v-for="(question, index) in quizStore.questions" :key="index" class="bg-gray-100 p-6 rounded-lg shadow">
        <p v-html="question.question" class="font-bold mb-4"></p>
        <p class="mb-2">Your Answer: <span :class="{'text-green-600 font-bold': isCorrect(index), 'text-red-600 font-bold': !isCorrect(index)}">{{ quizStore.answers[index] }}</span></p>
        <p v-if="!isCorrect(index)" class="italic text-gray-500">Correct Answer: {{ question.correct_answer }}</p>
      </li>
    </ul>

    <router-link to="/" class="inline-block mt-10 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition">
      Go Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { useQuizStore } from '../store/quiz';

const quizStore = useQuizStore();

onMounted(() => {
  const ctx = document.getElementById('quizSummaryChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [{
        label: 'Quiz Results',
        data: [
          Object.values(quizStore.answers).filter(answer => quizStore.questions.find(q => q.correct_answer === answer)).length,
          Object.values(quizStore.answers).filter(answer => !quizStore.questions.find(q => q.correct_answer === answer)).length
        ],
        backgroundColor: ['green', 'red'],
      }],
    },
  });
});

const isCorrect = (index: number) => {
  return quizStore.answers[index] === quizStore.questions[index].correct_answer;
};
</script>

<style scoped>
/* No custom styles needed as all styling is handled by Tailwind CSS */
</style>
