<template>
  <div
    v-if="quizStore.currentQuestion"
    class="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 sm:p-6"
  >
    <div
      class="max-w-3xl w-full mx-auto text-center p-6 sm:p-8 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-200"
    >
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2 sm:pb-4 dark:text-gray-200">
        Question {{ quizStore.currentQuestionIndex + 1 }} /
        {{ quizStore.questions.length }}
      </h2>
      <p
        v-html="quizStore.currentQuestion.question"
        class="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 dark:text-gray-200"
      ></p>

      <div v-for="(answer, index) in allAnswers" :key="index" class="mb-3 sm:mb-4">
        <input
          type="radio"
          :value="answer"
          :checked="selectedAnswer === answer"
          @change="handleSubmitAnswer(answer)"
          class="mr-2 sm:mr-3 cursor-pointer"
        />
        <label
          @click="handleSubmitAnswer(answer)"
          v-html="answer"
          class="text-base sm:text-lg text-gray-600 cursor-pointer dark:text-gray-200"
        ></label>
      </div>

      <QuizNavigation
        :isFirstQuestion="isFirstQuestion"
        :isLastQuestion="isLastQuestion"
        class="mt-6 sm:mt-8"
      />

      <QuizProgress class="mt-6 sm:mt-8" />
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-full">
    <p class="text-lg text-gray-500 dark:text-gray-300">
      No questions available. Please try again later.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useQuizStore } from "../store/quiz";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import QuizProgress from "../components/quiz/QuizProgress.vue";
import QuizNavigation from "../components/quiz/QuizNavigation.vue";

const quizStore = useQuizStore();
const selectedAnswer = ref<string | null>(null);
const router = useRouter();

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
  updateQuestionFlags();
  if (!quizStore.questions.length) {
    console.log("Error");
    router.push("/");
  }
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
  } else  {
    selectedAnswer.value = null
  }
};

const updateQuestionFlags = () => {
  isFirstQuestion.value = quizStore.currentQuestionIndex === 0;
  isLastQuestion.value =
    quizStore.currentQuestionIndex === quizStore.questions.length - 1;
};

const handleSubmitAnswer = (answer: string) => {
  selectedAnswer.value = answer;
  if (selectedAnswer.value) {
    quizStore.answerQuestion(selectedAnswer.value);
  }
};

onBeforeRouteLeave((to, from, next) => {
  console.log(from);
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
