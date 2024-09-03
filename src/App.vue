<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex flex-col flex-grow">
      <router-view />
    </main>

    <Footer class="mt-auto" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

</script>

<style scoped></style>
