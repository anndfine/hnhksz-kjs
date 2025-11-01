<!-- src/components/Sections/MembersSection.vue -->
<template>
  <section id="members" class="py-5">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-8 mx-auto text-center">
          <h2 class="display-4 fw-bold mb-3">成员风采</h2>
          <p class="lead text-muted">
            认识我们优秀的科技社成员，他们在各个技术领域展现才华。
          </p>
        </div>
      </div>

      <!-- 现任骨干 -->
      <div class="row mb-5">
        <div class="col-12">
          <h4 class="text-center border-bottom pb-2 mb-4 text-primary">2024届骨干成员</h4>
        </div>
        <div class="col-lg-3 col-md-4 col-6 mb-4">
          <div class="card border-0 shadow-sm h-100 text-center">
            <div class="card-body p-3">
              <div class="member-avatar mx-auto mb-3">
                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 80px;">
                  <i class="bi bi-person-fill display-6"></i>
                </div>
              </div>
              <h6 class="fw-bold mb-1">张明</h6>
              <p class="text-muted small mb-2">社长</p>
              <p class="text-muted small mb-3">擅长Python开发与算法设计</p>
              <div class="member-skills">
                <span class="badge bg-light text-dark small">Python</span>
                <span class="badge bg-light text-dark small">AI</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-6 mb-4">
          <div class="card border-0 shadow-sm h-100 text-center">
            <div class="card-body p-3">
              <div class="member-avatar mx-auto mb-3">
                <div class="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 80px;">
                  <i class="bi bi-person-fill display-6"></i>
                </div>
              </div>
              <h6 class="fw-bold mb-1">李华</h6>
              <p class="text-muted small mb-2">技术副社长</p>
              <p class="text-muted small mb-3">专注硬件开发与机器人制作</p>
              <div class="member-skills">
                <span class="badge bg-light text-dark small">Arduino</span>
                <span class="badge bg-light text-dark small">嵌入式</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-6 mb-4">
          <div class="card border-0 shadow-sm h-100 text-center">
            <div class="card-body p-3">
              <div class="member-avatar mx-auto mb-3">
                <div class="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 80px;">
                  <i class="bi bi-person-fill display-6"></i>
                </div>
              </div>
              <h6 class="fw-bold mb-1">王芳</h6>
              <p class="text-muted small mb-2">项目组长</p>
              <p class="text-muted small mb-3">热爱3D建模与创意设计</p>
              <div class="member-skills">
                <span class="badge bg-light text-dark small">3D建模</span>
                <span class="badge bg-light text-dark small">设计</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-6 mb-4">
          <div class="card border-0 shadow-sm h-100 text-center">
            <div class="card-body p-3">
              <div class="member-avatar mx-auto mb-3">
                <div class="bg-info rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 80px;">
                  <i class="bi bi-person-fill display-6"></i>
                </div>
              </div>
              <h6 class="fw-bold mb-1">陈伟</h6>
              <p class="text-muted small mb-2">开发组长</p>
              <p class="text-muted small mb-3">移动应用开发专家</p>
              <div class="member-skills">
                <span class="badge bg-light text-dark small">Flutter</span>
                <span class="badge bg-light text-dark small">App开发</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 往届骨干 -->
      <div class="row">
        <div class="col-12">
          <h4 class="text-center border-bottom pb-2 mb-4 text-muted">往届骨干成员</h4>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">刘强</h6>
            <p class="text-muted small mb-0">2023届社长</p>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">赵雪</h6>
            <p class="text-muted small mb-0">2023届副社长</p>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">孙磊</h6>
            <p class="text-muted small mb-0">2022届社长</p>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">周婷</h6>
            <p class="text-muted small mb-0">2022届技术总监</p>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">吴刚</h6>
            <p class="text-muted small mb-0">2021届社长</p>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-4 mb-3">
          <div class="text-center">
            <div class="member-avatar mx-auto mb-2">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px;">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
            <h6 class="fw-bold mb-1 small">郑小红</h6>
            <p class="text-muted small mb-0">2021届项目组长</p>
          </div>
        </div>
      </div>

      <!-- 成员统计 -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="bg-light rounded-4 p-4">
            <div class="row text-center">
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-primary">60+</div>
                <div class="text-muted">现任成员</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-success">4</div>
                <div class="text-muted">技术方向</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-info">15+</div>
                <div class="text-muted">往届骨干</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-warning">8</div>
                <div class="text-muted">获奖成员</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 成员风采组件逻辑
</script>

<style scoped>
.member-avatar {
  transition: transform 0.3s ease;
}

.card:hover .member-avatar {
  transform: scale(1.1);
}

.member-skills .badge {
  font-size: 0.7rem;
  margin: 0.1rem;
}
</style>
