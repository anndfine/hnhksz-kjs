<!-- src/components/Layout/Navbar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">
        <i class="bi bi-cpu-fill me-2"></i>
        海口四中科技社
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#home">首页</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#about">关于我们</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#activities">社团活动</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#projects">项目展示</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#members">成员风采</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#join">加入我们</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 导航栏组件逻辑
</script>
