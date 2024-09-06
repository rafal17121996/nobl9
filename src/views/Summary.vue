<template>
  <div class="p-4 sm:p-8 text-center pt-20 sm:pt-20 bg-white dark:bg-gray-800 shadow-lg">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8">Quiz Summary</h2>
    
    <p class="text-xl text-gray-700 dark:text-gray-300 mb-4">
      Your quiz time: <span class="font-bold">{{ quizStore.formattedElapsedTime }}</span>
    </p>
    
    <canvas id="quizSummaryChart" class="mb-10 max-w-lg mx-auto"></canvas>
    
    <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Questions and Answers</h3>
    <ul class="space-y-6">
      <li v-for="(question, index) in quizStore.questions" :key="index" class="bg-gray-100 dark:bg-gray-700 p-6 max-w-4xl mx-auto rounded-lg shadow">
        <p v-html="question.question" class="font-bold mb-4 dark:text-gray-200"></p>
        <p class="mb-2">
          Your Answer: 
          <span :class="{'text-green-600 dark:text-green-400 font-bold': isCorrect(index), 'text-red-600 dark:text-red-400 font-bold': !isCorrect(index)}">
            <p v-html="quizStore.answers[index] || 'No answer provided'" ></p>
          </span>
        </p>
        <p v-if="!isCorrect(index)" class="italic text-gray-500 dark:text-gray-400">
          Correct Answer: 
          <p v-html="question.correct_answer"></p>
        </p>
      </li>
    </ul>

    <router-link 
      to="/" 
      class="inline-block mt-10 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
    >
      Go Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';

const quizStore = useQuizStore();
const router = useRouter();

onMounted(() => {
  console.log(quizStore.isFinished)
  console.log(quizStore.isFinished)
  if (!quizStore.isFinished) {
    router.push("/");
  }

  const ctx = document.getElementById('quizSummaryChart') as HTMLCanvasElement;

  const correctAnswers = Object.values(quizStore.answers).filter(answer => answer && quizStore.questions.find(q => q.correct_answer.toLowerCase() === answer.toLowerCase())).length;
  const incorrectAnswers = Object.values(quizStore.answers).filter(answer => answer && !quizStore.questions.find(q => q.correct_answer.toLowerCase() === answer.toLowerCase())).length;
  const unansweredQuestions = quizStore.questions.length - (correctAnswers + incorrectAnswers);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Correct', 'Incorrect', 'Unanswered'],
      datasets: [{
        label: 'Quiz Results',
        data: [correctAnswers, incorrectAnswers, unansweredQuestions],
        backgroundColor: ['green', 'red', 'gray'],
      }],
    },
  });
});

const isCorrect = (index: number) => {
  const userAnswer = quizStore.answers[index];
  if (!userAnswer) return false;
  return userAnswer.toLowerCase() === quizStore.questions[index].correct_answer.toLowerCase();
};
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-3xl {
    max-width: 100%;
  }
  
  .p-8 {
    padding: 4px;
  }

  .text-3xl {
    font-size: 1.5rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }
}
</style>
