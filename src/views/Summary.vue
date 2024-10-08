<template>
  <div
    class="flex-grow p-4 sm:p-8 text-center pt-20 sm:pt-20 bg-white dark:bg-gray-800 shadow-lg"
  >
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
      Quiz Summary
    </h2>

    <!-- Quiz History Dropdown -->
    <QuizResultsDropdown
      :quizResults="quizResults"
      :selectedResultIndex="selectedResultIndex"
      @updateResult="updateSelectedResult"
    />
    <p class="text-xl text-gray-700 dark:text-gray-300 mb-4">
      Your quiz time:
      <span class="font-bold">{{
        selectedResult?.elapsedTime && formatTime(selectedResult.elapsedTime)
      }}</span>
    </p>

    <Chart
      :correctAnswers="correctAnswers"
      :incorrectAnswers="incorrectAnswers"
      :unansweredQuestions="unansweredQuestions"
    />

    <div class="mt-6">
      <QuestionsAndAnswers
        v-if="selectedResult?.questions && selectedResult.questions.length"
        :questions="selectedResult?.questions"
        :answers="Object.values(selectedResult?.answers || {})"
      />
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Chart from "../components/summary/Chart.vue";
import QuestionsAndAnswers from "../components/summary/QuestionsAndAnswers.vue";
import QuizResultsDropdown from "../components/summary/QuizResultsDropdown.vue";

const router = useRouter();
const quizResults = ref<any[]>([]);
const selectedResultIndex = ref(0);
const selectedResult = ref<any>(null);

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const unansweredQuestions = ref(0);

onMounted(() => {
  const storedResults = localStorage.getItem("quizResults");
  if (storedResults) {
    quizResults.value = JSON.parse(storedResults);
    selectedResultIndex.value = quizResults.value.length - 1;
    updateSelectedResult(selectedResultIndex.value);
  } else {
    const errorMessage = "No history, solve quiz to see results";
    router.push({ name: "Error", query: { message: errorMessage } });
  }
});

const updateSelectedResult = (index: number) => {
  selectedResultIndex.value = index;
  selectedResult.value = quizResults.value[selectedResultIndex.value];

  correctAnswers.value = selectedResult.value.questions.filter(
    (q: any, idx: number) => {
      const answer = selectedResult.value.answers[idx];
      return answer && q.correct_answer.toLowerCase() === answer.toLowerCase();
    }
  ).length;

  incorrectAnswers.value = selectedResult.value.questions.filter(
    (q: any, idx: number) => {
      const answer = selectedResult.value.answers[idx];
      return answer && q.correct_answer.toLowerCase() !== answer.toLowerCase();
    }
  ).length;

  unansweredQuestions.value = selectedResult.value.questions.filter(
    (q: any, idx: number) => {
      return !selectedResult.value.answers[idx];
    }
  ).length;
};

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
</script>
