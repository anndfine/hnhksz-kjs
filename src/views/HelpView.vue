<!-- src/views/help/GettingStarted.vue -->
<template>
    <div>
        <Navbar />
        <main>

            <div class="help-page">
                <HowToUseGithub />
            </div>
        </main>
        <Footer />
    </div>
</template>
<script setup lang="ts">

import Navbar from "@/components/Layout/Navbar.vue"
import Footer from '@/components/Layout/Footer.vue'
import HowToUseGithub from '@/views/helps/how-to-use-github.vue'
</script>