<template>
  <div v-if="questions && questions.length" class="mt-5 flex flex-col items-center">
    <div
      class="flex justify-center items-center flex-wrap max-w-full space-x-2 gap-y-4"
    >
      <span
        v-for="(question, index) in questions"
        :key="index"
        :class="[ 
          'sm:w-5 sm:h-5 w-3 h-3 rounded-full border-2 cursor-pointer transform transition-transform duration-300',
          answers[index]
            ? 'bg-green-500 border-green-500'
            : 'border-green-500 bg-transparent',
          quizStore.currentQuestionIndex === index ? 'scale-125' : '',
        ]"
        @click="goToQuestion(index)"
      ></span>
    </div>

    <button
      @click="finishQuiz"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
    >
      Finish Quiz
    </button>
  </div>
  <div v-else class="text-gray-500">Loading questions...</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuizStore } from "../../store/quiz";
import { useRouter } from "vue-router";

const quizStore = useQuizStore();
const router = useRouter();

const questions = computed(() => quizStore.questions);
const answers = computed(() => quizStore.answers);

const goToQuestion = (index: number) => {
  quizStore.currentQuestionIndex = index;
};

const finishQuiz = () => {
  if (quizStore.questions && quizStore.questions.length > 0) {
    quizStore.finishQuiz();
    router.push("/summary");
  } else {
    console.error("Questions data is not available.");
  }
};
</script>
