import { defineStore } from "pinia";
import { useLocalStorage } from "./session";

interface QuizState {
  questions: any[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  isFinished: boolean;
  elapsedTime: number;
  timerInterval: ReturnType<typeof setInterval> | null;
}

export const useQuizStore = defineStore("quiz", {
  state: (): QuizState => ({
    questions: [],
    currentQuestionIndex: 0,
    answers: {} as Record<number, string>,
    isFinished: false,
    elapsedTime: 0,
    timerInterval: null,
  }),
  actions: {
    async fetchQuestions(
      router: any,
      amount: number = 10,
      difficulty: string = "easy",
      selectedCategory: number = 1,
      retries: number = 0
    ) {
      const sessionStore = useLocalStorage();
      await sessionStore.fetchToken();

      if (retries >= 3) {
        throw new Error("Maximum retries reached. Please try again later.");
      }

      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=${selectedCategory}&difficulty=${difficulty}&token=${sessionStore.token}`
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(
              "Too Many Requests: Please wait a few moments before trying again."
            );
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        switch (data.response_code) {
          case 0:
            this.questions = data.results;
            break;
          case 1:
            throw new Error(
              "No Results: Could not return results. Not enough questions for your query."
            );
          case 2:
            throw new Error(
              "Invalid Parameter: The parameters provided are invalid."
            );
          case 3:
            throw new Error(
              "Token Not Found: The session token does not exist."
            );
          case 4:
            await sessionStore.resetToken();
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await this.fetchQuestions(
              router,
              amount,
              difficulty,
              selectedCategory,
              retries + 1
            );
            break;
          default:
            throw new Error("Unknown response code.");
        }
      } catch (error) {
        console.error("Error in fetchQuestions:", error);
        throw error;
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
      this.stopTimer();
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.isFinished = false;
      this.questions = [];
      this.elapsedTime = 0;
      this.stopTimer();
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.elapsedTime++;
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
  },
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    progress: (state) =>
      (state.currentQuestionIndex + 1) / state.questions.length,
    getAnswerForQuestion: (state) => (index: number) => state.answers[index],
    formattedElapsedTime: (state) => {
      const minutes = Math.floor(state.elapsedTime / 60);
      const seconds = state.elapsedTime % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    },
  },
});
