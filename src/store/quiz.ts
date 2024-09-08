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
        if (!sessionStore.token) return
        const response = await this.makeApiRequest(amount, difficulty, selectedCategory, sessionStore.token);
        await this.handleApiResponse(response, router, amount, difficulty, selectedCategory, retries);
      } catch (error) {
        console.error("Error in fetchQuestions:", error);
        throw error;
      }
    },
    async makeApiRequest(amount: number, difficulty: string, selectedCategory: number, token: string) {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${selectedCategory}&difficulty=${difficulty}&token=${token}`
      );

      if (!response.ok) {
        this.handleHttpError(response);
      }

      return response;
    },

    handleHttpError(response: Response) {
      switch (response.status) {
        case 400:
          throw new Error("Bad Request: The request was invalid.");
        case 401:
          throw new Error("Unauthorized: Access token is missing or invalid.");
        case 403:
          throw new Error("Forbidden: You do not have permission to access this resource.");
        case 404:
          throw new Error("Not Found: The requested resource could not be found.");
        case 429:
          throw new Error("Too Many Requests: Please wait a few moments before trying again.");
        case 500:
          throw new Error("Internal Server Error: Something went wrong on the server.");
        case 502:
          throw new Error("Bad Gateway: Invalid response from the upstream server.");
        case 503:
          throw new Error("Service Unavailable: The server is currently unable to handle the request.");
        case 504:
          throw new Error("Gateway Timeout: The server took too long to respond.");
        default:
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    },

    async handleApiResponse(
      response: Response,
      router: any,
      amount: number,
      difficulty: string,
      selectedCategory: number,
      retries: number
    ) {
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
          throw new Error("Invalid Parameter: The parameters provided are invalid.");
        case 3:
          await this.handleTokenError(router, amount, difficulty, selectedCategory, retries, false);
          break;
        case 4:
          await this.handleTokenError(router, amount, difficulty, selectedCategory, retries, true);
          break;
        default:
          throw new Error("Unknown response code.");
      }
    },

    async handleTokenError(
      router: any,
      amount: number,
      difficulty: string,
      selectedCategory: number,
      retries: number,
      resetToken: boolean
    ) {
      const sessionStore = useLocalStorage();

      if (resetToken) {
        await sessionStore.resetToken();
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.fetchQuestions(router, amount, difficulty, selectedCategory, retries + 1);
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
