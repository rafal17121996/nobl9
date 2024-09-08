<template>
  <div
    class="max-w-md mx-auto text-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
  >
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
      Set up your quiz
    </h2>

    <div v-if="isLoading" class="text-center">
      <svg
        class="animate-spin h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
        ></path>
      </svg>
      <p class="text-gray-700 dark:text-gray-300">Loading...</p>
    </div>

    <div v-else>
      <div class="mb-4">
        <label
          for="category"
          class="block text-left font-medium text-gray-700 dark:text-gray-300 mb-2"
          >Category:</label
        >
        <select
          id="category"
          v-model="selectedCategory"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label
          for="difficulty"
          class="block text-left font-medium text-gray-700 dark:text-gray-300 mb-2"
          >Difficulty:</label
        >
        <select
          id="difficulty"
          v-model="selectedDifficulty"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div class="mb-6">
        <label
          for="amount"
          class="block text-left font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Number of questions:
          <span class="font-bold">{{ selectedAmount }}</span>
        </label>
        <input
          type="range"
          id="amount"
          v-model="selectedAmount"
          min="5"
          max="20"
          class="w-full"
        />
      </div>

      <button
        @click="startQuiz"
        class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
      >
        Start Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "../../store/quiz";
import axios from "axios";

const router = useRouter();
const quizStore = useQuizStore();

const categories = ref<{ id: number; name: string }[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedDifficulty = ref<string>("easy");
const selectedAmount = ref<number>(10);
const isLoading = ref<boolean>(false);

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("https://opentdb.com/api_category.php");
    categories.value = response.data.trivia_categories;

    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0].id;
    } else {
      const errorMessage = 'Failed to fetch categories'
      router.push({ name: "Error", query: { message: errorMessage } });
    }
  } catch (error) {
    console.error("Failed to fetch categories", error);
  } finally {
    isLoading.value = false;
  }
};

const startQuiz = async () => {
  isLoading.value = true;
  quizStore.resetQuiz();

  if (!selectedCategory.value) {
    isLoading.value = false;
    return;
  }

  try {
    await quizStore.fetchQuestions(
      router,
      selectedAmount.value,
      selectedDifficulty.value,
      selectedCategory.value
    );
    router.push("/quiz");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    router.push({ name: "Error", query: { message: errorMessage } });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
