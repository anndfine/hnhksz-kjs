<!-- src/App.vue -->
<template>
  <div id="app">
    <Navbar />
    <main>
      <WelcomeSection />
      <AboutSection />
      <ActivitiesSection />
      <ProjectsSection />
      <MembersSection />
      <JoinSection />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Layout/Navbar.vue"
import Footer from '@/components/Layout/Footer.vue'
import WelcomeSection from '@/components/Sections/HeroSection.vue'
import AboutSection from '@/components/Sections/AboutSection.vue'
import ActivitiesSection from '@/components/Sections/ActivitiesSection.vue'
import ProjectsSection from '@/components/Sections/ProjectsSection.vue'
import MembersSection from '@/components/Sections/MembersSection.vue'
import JoinSection from '@/components/Sections/JoinSection.vue'

import { onMounted } from 'vue'

onMounted(() => {
  console.log('科技社官网初始化...')
})
</script>

<style>
@import '@/styles/globals.css';
</style>