import { defineStore } from "pinia";
import { makeApiRequest } from "../services/apiService";
import { getToken, resetToken } from "../services/sessionService";

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
    // Fetches the quiz questions from the API
    async fetchQuestions(
      amount: number = 10,
      difficulty: string = "easy",
      selectedCategory: number = 1,
      retries: number = 0
    ) {
      const token = await getToken();
      // If retries exceed 3, stop retrying and throw an error
      if (retries >= 3) {
        throw new Error("Maximum retries reached. Please try again later.");
      }

      try {
        if (!token) return;
        const response = await makeApiRequest(
          amount,
          difficulty,
          selectedCategory,
          token
        );
        await this.handleApiResponse(
          response,
          amount,
          difficulty,
          selectedCategory,
          retries
        );
      } catch (error) {
        console.error("Error in fetchQuestions:", error);
        throw error;
      }
    },

    // Handles the response from the API
    async handleApiResponse(
      response: Response,
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
          throw new Error(
            "Invalid Parameter: The parameters provided are invalid."
          );
        case 3:
          await this.handleTokenError(
            amount,
            difficulty,
            selectedCategory,
            retries,
            true
          );  
          break;
        case 4:
          await this.handleTokenError(
            amount,
            difficulty,
            selectedCategory,
            retries,
            true
          );
          break;
        default:
          throw new Error("Unknown response code.");
      }
    },

    // Handles token-related errors and retries the request
    async handleTokenError(
      amount: number,
      difficulty: string,
      selectedCategory: number,
      retries: number,
      reset: boolean
    ) {
      if (reset) {
        console.log('reset')
        await resetToken();
      }
      // Wait for 5 seconds before retrying (handle too many req)
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.fetchQuestions(
        amount,
        difficulty,
        selectedCategory,
        retries + 1
      );
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
      this.saveQuizResult();
    },
    // Saves the quiz result in local storage
    saveQuizResult() {
      const correctAnswers = Object.keys(this.answers).filter((index) => {
        const question = this.questions[Number(index)];
        return question.correct_answer === this.answers[Number(index)];
      }).length;

      const quizResult = {
        date: new Date().toISOString(),
        correctAnswers: correctAnswers,
        totalQuestions: this.questions.length,
        elapsedTime: this.elapsedTime,
        questions: this.questions,
        answers: this.answers,
      };

      const storedResults = JSON.parse(
        localStorage.getItem("quizResults") || "[]"
      );

      storedResults.push(quizResult);

      localStorage.setItem("quizResults", JSON.stringify(storedResults));
    },

    // Resets the quiz state to start a new quiz
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
    // Format the elapsed time in mm:ss format
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
