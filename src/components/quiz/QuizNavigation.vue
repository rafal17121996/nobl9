<template>
  <div class="flex justify-center space-x-4 mt-4">
    <button
      @click="goToPreviousQuestion"
      :disabled="isFirstQuestion"
      class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      @click="goToNextQuestion"
      :disabled="isLastQuestion"
      class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useQuizStore } from "../../store/quiz";

const props = defineProps({
  isFirstQuestion: Boolean,
  isLastQuestion: Boolean,
});

console.log(props)

const emit = defineEmits(["submit-answer"]);

const quizStore = useQuizStore();

const goToPreviousQuestion = () => {
  quizStore.goToPreviousQuestion();
};

const goToNextQuestion = () => {
  quizStore.goToNextQuestion();
};
</script>
