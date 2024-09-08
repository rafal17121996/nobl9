<template>
  <div v-for="(answer, index) in answers" :key="index" class="mb-3 sm:mb-4">
    <input
      type="radio"
      :value="answer"
      :checked="selectedAnswer === answer"
      @change="selectAnswer(answer)"
      class="mr-2 sm:mr-3 cursor-pointer"
    />
    <label
      @click="selectAnswer(answer)"
      v-html="answer"
      class="text-sm sm:text-lg text-gray-600 cursor-pointer dark:text-gray-200"
    ></label>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  answers: Array as PropType<string[]>,
  selectedAnswer: String,
});
const emit = defineEmits(["submitAnswer"]);

const selectAnswer = (answer: unknown) => {
  if (typeof answer === "string") {
    emit("submitAnswer", answer);
  }
};
</script>
