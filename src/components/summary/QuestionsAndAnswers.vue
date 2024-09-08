<template>
    <div>
      <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Questions and Answers</h3>
      <ul class="space-y-6">
        <li v-for="(question, index) in questions" :key="index" class="bg-gray-100 dark:bg-gray-700 p-6 max-w-4xl mx-auto rounded-lg shadow">
          <p v-html="question.question" class="font-bold mb-4 dark:text-gray-200"></p>
          <p class="mb-2">
            Your Answer: 
            <span :class="{'text-green-600 dark:text-green-400 font-bold': isCorrect(index), 'text-red-600 dark:text-red-400 font-bold': !isCorrect(index)}">
              <p v-html="answers[index] || 'No answer provided'"></p>
            </span>
          </p>
          <p v-if="!isCorrect(index)" class="italic text-gray-500 dark:text-gray-400">
            Correct Answer: 
            <p v-html="question.correct_answer"></p>
          </p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Question {
    question: string;
    correct_answer: string;
  }
  
  const props = defineProps<{
    questions: Question[],
    answers: Record<number, string>
  }>();
  
  const isCorrect = (index: number) => {
    const userAnswer = props.answers[index];
    if (!userAnswer) return false;
    return userAnswer.toLowerCase() === props.questions[index].correct_answer.toLowerCase();
  };
  </script>
  