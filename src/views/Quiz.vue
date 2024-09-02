<template>
  <div
    v-if="isLoading"
    class="flex justify-center items-center h-screen"
  >
    <svg class="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
    </svg>
  </div>

  <div
    v-else-if="quizStore.currentQuestion"
    class="flex-grow flex flex-col items-center justify-center bg-gray-100 h-[600px]"
  >
    <div class="max-w-3xl w-full mx-auto text-center p-8 bg-white shadow-lg rounded-lg">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
        Question {{ quizStore.currentQuestionIndex + 1 }} /
        {{ quizStore.questions.length }}
      </h2>
      <p v-html="quizStore.currentQuestion.question" class="text-xl text-gray-700 mb-8"></p>

      <div v-for="(answer, index) in allAnswers" :key="index" class="mb-4">
        <input
          type="radio"
          :value="answer"
          :checked="selectedAnswer === answer"
          @change="selectedAnswer = answer"
          class="mr-3 cursor-pointer"
        />
        <label v-on:click="selectedAnswer = answer" v-html="answer" class="text-lg text-gray-600 cursor-pointer"></label>
      </div>

      <QuizNavigation
        :isFirstQuestion="isFirstQuestion"
        :isLastQuestion="isLastQuestion"
        @submit-answer="handleSubmitAnswer"
        class="mt-8"
      />

      <QuizProgress class="mt-8" />
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-full">
    <p class="text-lg text-gray-500">No questions available. Please try again later.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useQuizStore } from "../store/quiz";
import { onBeforeRouteLeave } from "vue-router";
import QuizProgress from "../components/quiz/QuizProgress.vue";
import QuizNavigation from "../components/quiz/QuizNavigation.vue";

const quizStore = useQuizStore();
const selectedAnswer = ref<string | null>(null);
const isLoading = ref(true); // Zmienna do kontrolowania widoczności loadera

const isFirstQuestion = ref(false);
const isLastQuestion = ref(false);

const allAnswers = computed(() => {
  if (quizStore.currentQuestion) {
    return [
      ...quizStore.currentQuestion.incorrect_answers,
      quizStore.currentQuestion.correct_answer,
    ].sort((a, b) => a.localeCompare(b));
  }
  return [];
});

onMounted(() => {
  quizStore.fetchQuestions().then(() => {
    setSelectedAnswer();
    updateQuestionFlags();
    isLoading.value = false; 
  });
});

watch(
  () => quizStore.currentQuestionIndex,
  () => {
    setSelectedAnswer();
    updateQuestionFlags();
  }
);

const setSelectedAnswer = () => {
  const savedAnswer = quizStore.getAnswerForQuestion(
    quizStore.currentQuestionIndex
  );
  if (savedAnswer) {
    selectedAnswer.value = savedAnswer;
  } else if (allAnswers.value.length > 0) {
    selectedAnswer.value = allAnswers.value[0];
  }
};

const updateQuestionFlags = () => {
  isFirstQuestion.value = quizStore.currentQuestionIndex === 0;
  isLastQuestion.value =
    quizStore.currentQuestionIndex === quizStore.questions.length - 1;
};

const handleSubmitAnswer = () => {
  if (selectedAnswer.value) {
    quizStore.answerQuestion(selectedAnswer.value);
    quizStore.goToNextQuestion();
  }
};

onBeforeRouteLeave((to, from, next) => {
  console.log(from)
  if (to.path === "/error" || quizStore.isFinished) {
    next();
  } else {
    if (
      confirm(
        "Are you sure you want to leave the quiz? Your progress will be lost."
      )
    ) {
      quizStore.resetQuiz();
      next();
    } else {
      next(false);
    }
  }
});
</script>

<style scoped></style>
