
# Quiz Application

## Demo

A live demo of the application is available at: [nobl9.vercel.app](https://nobl9.vercel.app)

## Project Description

This project is a Quiz application that uses the **Trivia API** to fetch questions and allows users to answer them in a quiz format. The application tracks the user's progress, shows correct and incorrect answers, and allows users to select the difficulty level and number of questions. At the end of the quiz, a summary of the results is presented.

### Features:

- Fetching questions from the **Trivia API**
- Option to select the difficulty level (easy, medium, hard)
- Option to select the number of questions (5 to 20)
- Displaying quiz progress
- Saving user answers
- Timer tracking the time spent on the quiz
- Summary of quiz results with correct/incorrect answers
- API error handling
- Light and dark mode support

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:

2. Navigate to the project directory:

    ```bash
    cd nobl9_quiz
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Running the Application

To run the application locally, use the following command:

```bash
npm run dev
```

This will start a local development server. Open your browser and go to `http://localhost:5173/`.

## Running Tests

To run the unit tests for the application, use the following command:

```bash
npm run test:unit
```

The project uses **Jest** and **Vue Test Utils** for unit testing, along with **Pinia** for state management. The tests cover actions such as fetching questions, navigating between questions, and submitting answers.

## Project Stack

- **Vue 3**: Frontend framework
- **Pinia**: State management
- **Vue Router**: Navigation
- **Jest**: Unit testing
- **Trivia API**: For fetching quiz questions
- **Vite**: Build tool

## Deployment

The project is deployed on [Vercel](https://vercel.com). Any changes to the `main` branch will trigger a redeployment to the live demo at [nobl9.vercel.app](https://nobl9.vercel.app).
