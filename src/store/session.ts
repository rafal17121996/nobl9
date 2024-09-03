import { defineStore } from "pinia";
import axios from "axios";

export const useLocalStorage = defineStore("session", {
  state: () => ({
    token: localStorage.getItem("quizToken") as string | null,
    tokenTimestamp: localStorage.getItem("quizTokenTimestamp") as string | null,
  }),

  actions: {
    async fetchToken() {
      if (!this.token) {
        console.log("Fetch token");
        try {
          const response = await axios.get(
            "https://opentdb.com/api_token.php?command=request"
          );
          this.token = response.data.token;
          if (this.token) {
            const timestamp = new Date().getTime().toString();
            localStorage.setItem("quizToken", this.token);
            localStorage.setItem("quizTokenTimestamp", timestamp);
            this.tokenTimestamp = timestamp;
          }
        } catch (error) {
          console.error("Failed to fetch session token", error);
        }
      } else {
        if (this.isTokenExpired()) {
          console.log("Reset existing token");
          this.resetToken();
        } else {
          console.log("Using existing token");
        }
      }
    },

    isTokenExpired(): boolean {
      if (!this.tokenTimestamp) return true;
      const now = new Date().getTime();
      const tokenTime = parseInt(this.tokenTimestamp);
      const hoursSinceTokenGenerated = (now - tokenTime) / (1000 * 60 * 60);
      return hoursSinceTokenGenerated >= 6;
    },

    async resetToken() {
      if (this.token) {
        try {
          await axios.get(
            `https://opentdb.com/api_token.php?command=reset&token=${this.token}`
          );
          localStorage.removeItem("quizToken");
          localStorage.removeItem("quizTokenTimestamp");
          this.token = null;
          this.tokenTimestamp = null;
          await this.fetchToken();
        } catch (error) {
          console.error("Failed to reset session token", error);
        }
      }
    },
  },
});
