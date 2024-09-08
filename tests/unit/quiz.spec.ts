import { setActivePinia, createPinia } from "pinia";
import { useQuizStore } from "../../src/store/quiz";
import { useLocalStorage } from "../../src/store/session";

describe("Quiz Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should throw an error immediately if retries are 3', async () => {
    const quizStore = useQuizStore();
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response_code: 4, 
        results: [],
      }),
    });

    const sessionStore = useLocalStorage();
    jest.spyOn(sessionStore, 'fetchToken').mockResolvedValue();  
    jest.spyOn(sessionStore, 'resetToken').mockResolvedValue();  

    try {
      await quizStore.fetchQuestions(10, 'easy', 1, 3);
    } catch (error) {
     
      expect(error).toEqual(new Error('Maximum retries reached. Please try again later.'));
    }
  });

  it("should store answer for current question", () => {
    const quizStore = useQuizStore();

    quizStore.questions = [
      {
        question: "Question 1?",
        correct_answer: "Answer 1",
        incorrect_answers: ["Answer 2", "Answer 3"],
      },
      {
        question: "Question 2?",
        correct_answer: "Answer 4",
        incorrect_answers: ["Answer 5", "Answer 6"],
      },
    ];

    quizStore.answerQuestion("Answer 1");

    expect(quizStore.answers[0]).toBe("Answer 1");
  });


  it("should increment elapsed time correctly", () => {
    const quizStore = useQuizStore();

    quizStore.startTimer();

    jest.advanceTimersByTime(3000); 

    expect(quizStore.elapsedTime).toBe(3);

    quizStore.stopTimer();
  });
});
