<template>
    <div class="sm:mb-10 max-w-lg mx-auto">
      <apexchart width="500" type="pie" :options="chartOptions" :series="chartData"></apexchart>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    correctAnswers: {
      type: Number,
      default: 0,  
    },
    incorrectAnswers: {
      type: Number,
      default: 0,
    },
    unansweredQuestions: {
      type: Number,
      default: 0,  
    },
  });
  
  const chartOptions = ref({});
  const chartData = ref([props.correctAnswers, props.incorrectAnswers, props.unansweredQuestions]);
  
  const updateChartData = () => {
    chartData.value = [props.correctAnswers, props.incorrectAnswers, props.unansweredQuestions];
  };
  
  watch(
    () => [props.correctAnswers, props.incorrectAnswers, props.unansweredQuestions],
    () => {
      updateChartData();
    }
  );
  
  chartOptions.value = {
    chart: {
      type: 'pie',
    },
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    legend: {
      position: 'top',
      fontSize: '16px',
      labels: {
        colors: ['#16a34a', '#dc2626', '#6b7280'], 
      }
    },
    colors: ['#16a34a', '#dc2626', '#6b7280'], 
    responsive: [{
      breakpoint: 640,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          fontSize: '14px',
        },
      }
    }],
  };
  </script>
