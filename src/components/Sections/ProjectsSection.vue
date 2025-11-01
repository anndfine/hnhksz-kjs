<!-- src/components/Sections/ProjectsSection.vue -->
<template>
  <section id="projects" class="py-5 bg-light">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-8 mx-auto text-center">
          <h2 class="display-4 fw-bold mb-3">项目展示</h2>
          <p class="lead text-muted">
            科技社成员们开发的各种创新项目，展现我们的技术实力和创造力。
          </p>
        </div>
      </div>

      <div class="row g-4">
        <!-- 项目1 -->
        <div class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="project-image position-relative overflow-hidden">
              <div class="placeholder-image bg-primary d-flex align-items-center justify-content-center text-white"
                style="height: 200px;">
                <i class="bi bi-robot display-4"></i>
              </div>
              <div
                class="project-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button class="btn btn-light rounded-pill px-4">查看详情</button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">科技社物联网改造</h4>
                <span class="badge bg-success">进行中</span>
              </div>
              <p class="text-muted mb-3">
                基于物联网技术的智慧校园解决方案，实现智能堆肥机远程控制、社员活动智能打卡系统、环境监测数据实时采集等功能，提升科技社管理效率与智能化水平。
              </p>
              <div class="project-tech">
                <span class="badge bg-light text-dark me-2">开发板</span>
                <span class="badge bg-light text-dark me-2">Node.JS</span>
                <span class="badge bg-light text-dark">C++</span>
              </div>
              <div class="project-meta mt-3 d-flex justify-content-between text-muted small">
                <span><i class="bi bi-person me-1"></i>等5人</span>
                <span><i class="bi bi-calendar me-1"></i>2025.11</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目2 -->
        <!-- <div class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="project-image position-relative overflow-hidden">
              <div class="placeholder-image bg-success d-flex align-items-center justify-content-center text-white"
                style="height: 200px;">
                <i class="bi bi-phone display-4"></i>
              </div>
              <div
                class="project-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button class="btn btn-light rounded-pill px-4">查看详情</button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">校园导览App</h4>
                <span class="badge bg-primary">已完成</span>
              </div>
              <p class="text-muted mb-3">
                为新生开发的校园导航应用，包含地图导览、设施查询、活动通知等功能。
              </p>
              <div class="project-tech">
                <span class="badge bg-light text-dark me-2">Flutter</span>
                <span class="badge bg-light text-dark me-2">Dart</span>
                <span class="badge bg-light text-dark">Firebase</span>
              </div>
              <div class="project-meta mt-3 d-flex justify-content-between text-muted small">
                <span><i class="bi bi-person me-1"></i>李四 等3人</span>
                <span><i class="bi bi-calendar me-1"></i>2023.12</span>
              </div>
            </div>
          </div>
        </div> -->

        <!-- 项目3 -->
        <div class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="project-image position-relative overflow-hidden">
              <div class="placeholder-image bg-warning d-flex align-items-center justify-content-center text-white"
                style="height: 200px;">
                <i class="bi bi-printer display-4"></i>
              </div>
              <div
                class="project-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button class="btn btn-light rounded-pill px-4">查看详情</button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">3D打印创意作品</h4>
                <span class="badge bg-secondary">规划中</span>

                <!-- <span class="badge bg-primary">已完成</span> -->
              </div>
              <p class="text-muted mb-3">
                使用3D打印技术制作的各种创意作品，包括建筑模型、机械零件和艺术装饰。
              </p>
              <div class="project-tech">
                <span class="badge bg-light text-dark me-2">3D建模</span>
                <span class="badge bg-light text-dark me-2">3D打印机</span>
                <span class="badge bg-light text-dark">3D打印</span>
              </div>
              <div class="project-meta mt-3 d-flex justify-content-between text-muted small">
                <span><i class="bi bi-person me-1"></i>等3人</span>
                <span><i class="bi bi-calendar me-1"></i>2025.11</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目4 -->
        <div class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="project-image position-relative overflow-hidden">
              <div class="placeholder-image bg-info d-flex align-items-center justify-content-center text-white"
                style="height: 200px;">
                <i class="bi bi-motherboard display-4"></i>
              </div>
              <div
                class="project-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button class="btn btn-light rounded-pill px-4">查看详情</button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">校园气象站</h4>
                <!-- <span class="badge bg-success">进行中</span> -->
                <span class="badge bg-primary">已完成</span>

              </div>
              <p class="text-muted mb-3">
                气象监测设备，能够实时采集温度、湿度、气压等数据并通过屏幕显示。
              </p>
              <div class="project-tech">
                <span class="badge bg-light text-dark me-2">传感器</span>
                <span class="badge bg-light text-dark">物联网</span>
              </div>
              <div class="project-meta mt-3 d-flex justify-content-between text-muted small">
                <span><i class="bi bi-person me-1"></i>数据缺失</span>
                <span><i class="bi bi-calendar me-1"></i>数据缺失</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目5 -->
        <div class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="project-image position-relative overflow-hidden">
              <div class="placeholder-image bg-danger d-flex align-items-center justify-content-center text-white"
                style="height: 200px;">
                <i class="bi bi-graph-up display-4"></i>
              </div>
              <div
                class="project-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button class="btn btn-light rounded-pill px-4">查看详情</button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">数据分析平台</h4>
                <span class="badge bg-secondary">规划中</span>
              </div>
              <p class="text-muted mb-3">
                基于Python的数据分析项目，处理和分析校园各类数据，生成可视化报告。
              </p>
              <div class="project-tech">
                <span class="badge bg-light text-dark me-2">Python</span>
                <span class="badge bg-light text-dark me-2">Pandas</span>
                <span class="badge bg-light text-dark">数据可视化</span>
              </div>
              <div class="project-meta mt-3 d-flex justify-content-between text-muted small">
                <span><i class="bi bi-person me-1"></i>钱七 等6人</span>
                <span><i class="bi bi-calendar me-1"></i>2024.04</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目6 - 更多项目提示 -->
        <div class="col-lg-4 col-md-6">
          <div class="card border-0 bg-transparent shadow-none h-100">
            <div class="card-body d-flex align-items-center justify-content-center border rounded-3 border-dashed">
              <div class="text-center">
                <i class="bi bi-plus-circle display-4 text-muted mb-3"></i>
                <h5 class="text-muted">更多项目</h5>
                <p class="text-muted small">持续更新中...</p>
                <a href="#join" class="btn btn-outline-primary mt-2">参与项目开发</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目统计 -->
      <div class="row mt-5 pt-5">
        <div class="col-12">
          <div class="bg-white rounded-4 shadow-sm p-4">
            <div class="row text-center">
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-primary">15+</div>
                <div class="text-muted">已完成项目</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-success">8+</div>
                <div class="text-muted">进行中项目</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-info">50+</div>
                <div class="text-muted">参与成员</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-warning">3</div>
                <div class="text-muted">获奖项目</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 项目展示组件逻辑
</script>

<style scoped>
.project-card {
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
}

.project-image {
  border-radius: 0.375rem 0.375rem 0 0;
}

.placeholder-image {
  transition: all 0.3s ease;
}

.project-overlay {
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: all 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-card:hover .placeholder-image {
  transform: scale(1.05);
}

.border-dashed {
  border-style: dashed !important;
  border-color: #dee2e6 !important;
}
</style>