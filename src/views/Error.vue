<template>
    <div class="error-page">
      <h1>Error</h1>
      <p>{{ errorMessage }}</p>
      <router-link to="/">Go Back to Home</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const errorMessage = route.query.message || 'An unexpected error occurred.';
  </script>
  
  <style scoped>
  .error-page {
    text-align: center;
    padding: 50px;
  }
  
  .error-page h1 {
    color: red;
    font-size: 48px;
  }
  
  .error-page p {
    font-size: 18px;
    color: #333;
  }
  
  .error-page a {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  
  .error-page a:hover {
    background-color: #358a6d;
  }
  </style>