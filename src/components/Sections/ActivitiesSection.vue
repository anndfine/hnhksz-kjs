<!-- src/components/Sections/ActivitiesSection.vue -->
<template>
  <section id="activities" class="py-5">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-8 mx-auto text-center">
          <h2 class="display-4 fw-bold mb-3">社团活动</h2>
          <p class="lead text-muted">
            我们定期组织各类科技活动，涵盖编程、机器人、3D打印等多个领域。
          </p>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="activity-card card border-0 shadow-sm h-100">
            <div class="row g-0 h-100">
              <div class="col-md-4 d-flex align-items-center justify-content-center bg-primary text-white">
                <i class="bi bi-code-slash display-4"></i>
              </div>
              <div class="col-md-8">
                <div class="card-body p-4">
                  <h4 class="fw-bold">编程学习</h4>
                  <p class="text-muted">学习Python、C++等编程语言，参与算法竞赛和项目开发。</p>
                  <div class="mt-3">
                    <span class="badge bg-light text-dark me-2">Python</span>
                    <span class="badge bg-light text-dark me-2">C++</span>
                    <span class="badge bg-light text-dark">算法</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="activity-card card border-0 shadow-sm h-100">
            <div class="row g-0 h-100">
              <div class="col-md-4 d-flex align-items-center justify-content-center bg-success text-white">
                <i class="bi bi-robot display-4"></i>
              </div>
              <div class="col-md-8">
                <div class="card-body p-4">
                  <h4 class="fw-bold">机器人制作</h4>
                  <p class="text-muted">设计和制作机器人，参与机器人竞赛，学习自动控制原理。</p>
                  <div class="mt-3">
                    <span class="badge bg-light text-dark me-2">Arduino</span>
                    <span class="badge bg-light text-dark me-2">机械设计</span>
                    <span class="badge bg-light text-dark">传感器</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="activity-card card border-0 shadow-sm h-100">
            <div class="row g-0 h-100">
              <div class="col-md-4 d-flex align-items-center justify-content-center bg-warning text-white">
                <i class="bi bi-printer display-4"></i>
              </div>
              <div class="col-md-8">
                <div class="card-body p-4">
                  <h4 class="fw-bold">3D打印</h4>
                  <p class="text-muted">学习3D建模和打印技术，将创意转化为实体作品。</p>
                  <div class="mt-3">
                    <span class="badge bg-light text-dark me-2">建模</span>
                    <span class="badge bg-light text-dark me-2">设计</span>
                    <span class="badge bg-light text-dark">制造</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="activity-card card border-0 shadow-sm h-100">
            <div class="row g-0 h-100">
              <div class="col-md-4 d-flex align-items-center justify-content-center bg-info text-white">
                <i class="bi bi-motherboard display-4"></i>
              </div>
              <div class="col-md-8">
                <div class="card-body p-4">
                  <h4 class="fw-bold">电子制作</h4>
                  <p class="text-muted">学习电路原理，制作电子小作品，培养动手能力。</p>
                  <div class="mt-3">
                    <span class="badge bg-light text-dark me-2">电路</span>
                    <span class="badge bg-light text-dark me-2">焊接</span>
                    <span class="badge bg-light text-dark">单片机</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 社团活动组件逻辑
</script>
