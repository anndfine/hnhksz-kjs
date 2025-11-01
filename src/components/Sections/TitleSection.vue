<!-- src/components/Sections/HeroSection.vue -->
<template>
  <section id="home" class="hero-section min-vh-100 d-flex align-items-center" :style="heroSectionStyle">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1 class="display-3 fw-bold text-white mb-4">
            探索科技<br>创造未来
          </h1>
          <p class="lead text-light mb-4">
            海口市第四中学科技社是一个致力于培养学生科技创新能力和实践能力的社团。
            <br>
            探索前沿科技，开展丰富活动，培养未来科技人才
          </p>
          <div class="d-flex gap-3">
            <a href="#about" class="btn btn-light btn-lg px-4">了解更多</a>
            <a href="#join" class="btn btn-outline-light btn-lg px-4">加入我们</a>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <div class="hero-image d-none">
            <i class="bi bi-robot display-1 text-white"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CSSProperties } from 'vue'

// 背景图片URL - 在此处修改图片URL
// 示例: const backgroundImageUrl = ref('https://example.com/image.jpg')
// 留空则使用默认渐变背景
const backgroundImageUrl = ref('https://cn1.anndfine.top/downloadfiles/fTzCjwUhkpw')
// 图片加载状态
const imageLoaded = ref(false)

// 计算英雄区域样式
const heroSectionStyle = computed((): CSSProperties => {
  if (imageLoaded.value && backgroundImageUrl.value) {
    return {
      backgroundImage: `url('${backgroundImageUrl.value}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative' as const
    }
  }
  return {} as CSSProperties // 返回空对象，使用CSS中定义的默认背景
})

// 检查图片是否可以加载
const checkImageLoad = () => {
  if (!backgroundImageUrl.value) return

  const img = new Image()
  img.onload = () => {
    imageLoaded.value = true
  }
  img.onerror = () => {
    imageLoaded.value = false
    console.warn('背景图片加载失败，使用默认背景')
  }
  img.src = backgroundImageUrl.value
}

onMounted(() => {
  // 如果有背景图片URL，则检查图片加载状态
  if (backgroundImageUrl.value) {
    checkImageLoad()
  }
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  margin-top: 56px;
  /* 导航栏高度 */
  transition: background-image 0.5s ease-in-out;
}

/* 当背景图片加载成功时，添加一个半透明的遮罩层，确保文字可读性 */
.hero-section[style*="background-image"]::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

/* 确保内容在遮罩层之上 */
.hero-section .container {
  position: relative;
  z-index: 1;
}

.hero-image {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}
</style>