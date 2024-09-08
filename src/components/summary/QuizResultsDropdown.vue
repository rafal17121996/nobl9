<template>
  <div class="mt-6 mb-4">
    <label
      for="quizResultsDropdown"
      class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4"
      >Select a quiz result:</label
    >
    <select
      id="quizResultsDropdown"
      :value="selectedResultIndex"
      @change="emitSelection"
      class="ml-4 p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition"
    >
      <option
          v-for="(result, index) in quizResults"
          :key="index"
          :value="index"
        >
          {{ new Date(result.date).toLocaleString() }}
        </option>
    </select>
  </div>
</template>

<script setup lang="ts">

interface QuizResult {
  date: string;
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime: number;
  questions: any[]; 
  answers: Record<number, string>;
}

const props = defineProps<{
  quizResults: QuizResult[];
  selectedResultIndex: number;
}>();

const emit = defineEmits(["updateResult"]);

const emitSelection = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit("updateResult", Number(target.value));
  }
};
</script>
