<template>
  <div class="mt-5 flex flex-col items-center">
    <div class="flex justify-center space-x-2">
      <span
        v-for="(, index) in questions"
        :key="index"
        :class="[
          'w-5 h-5 rounded-full border-2 cursor-pointer',
          answers[index] ? 'bg-green-500 border-green-500' : 'border-green-500 bg-transparent'
        ]"
        @click="goToQuestion(index)"
      ></span>
    </div>

    <button
      v-if="allAnswersSelected"
      @click="finishQuiz"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
    >
      Finish Quiz
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuizStore } from '../../store/quiz';
import { useRouter } from 'vue-router';

const quizStore = useQuizStore();
const router = useRouter();

const questions = computed(() => quizStore.questions);
const answers = computed(() => quizStore.answers);

const allAnswersSelected = computed(() => {
  return questions.value.length === Object.keys(answers.value).length;
});

const goToQuestion = (index: number) => {
  quizStore.currentQuestionIndex = index;
};

const finishQuiz = () => {
  quizStore.finishQuiz();
  router.push('/summary');
};
</script>
