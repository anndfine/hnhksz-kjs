<!-- src/components/Sections/HeroSection.vue -->
<template>
  <section id="home" class="hero-section min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1 class="display-3 fw-bold text-white mb-4">
            探索科技<br>创造未来
          </h1>
          <p class="lead text-light mb-4">
            海口市第四中学科技社是一个致力于培养学生科技创新能力和实践能力的社团。
            我们探索前沿科技，开展丰富活动，培养未来科技人才。
          </p>
          <div class="d-flex gap-3">
            <a href="#about" class="btn btn-light btn-lg px-4">了解更多</a>
            <a href="#join" class="btn btn-outline-light btn-lg px-4">加入我们</a>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <div class="hero-image">
            <i class="bi bi-robot display-1 text-white"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 英雄区域组件逻辑
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  margin-top: 76px; /* 导航栏高度 */
}

.hero-image {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style>
