<!-- src/views/help/GettingStarted.vue -->
<template>
    <div>
        <Navbar />
        <main>
            <HelpContents />
        </main>
        <Footer />
    </div>
</template>
<script setup lang="ts">

import Navbar from "@/components/Layout/Navbar.vue"
import Footer from '@/components/Layout/Footer.vue'
import HelpContents from '@/views/helps/contents.vue'
</script>