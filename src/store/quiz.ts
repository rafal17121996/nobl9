import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useLocalStorage } from "./session";

interface QuizState {
  questions: any[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  isFinished: boolean;
}

export const useQuizStore = defineStore("quiz", {
  state: (): QuizState => ({
    questions: [],
    currentQuestionIndex: 0,
    answers: {} as Record<number, string>,
    isFinished: false,
  }),
  actions: {
    async fetchQuestions(amount: number = 10, difficulty: string = "easy", selectedCategory: number = 1) {
      const router = useRouter();
      const sessionStore = useLocalStorage(); 
      await sessionStore.fetchToken();
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=${selectedCategory}&difficulty=${difficulty}&token=${sessionStore.token}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        this.questions = data.results;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        router.push({ name: "Error", query: { message: errorMessage } });
      }
    },
    answerQuestion(answer: string) {
      this.answers[this.currentQuestionIndex] = answer;
    },
    goToNextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    goToPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    finishQuiz() {
      this.isFinished = true;
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.isFinished = false;
      this.questions = [];
    },
  },
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    progress: (state) =>
      (state.currentQuestionIndex + 1) / state.questions.length,
    getAnswerForQuestion: (state) => (index: number) => state.answers[index], // Getter do pobierania odpowiedzi dla danego pytania
  },
});
