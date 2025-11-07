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
        <!-- 项目卡片 -->
        <div v-for="project in projects" :key="project.id" class="col-lg-4 col-md-6">
          <div class="project-card card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h4 class="fw-bold">{{ project.title }}</h4>
                <span :class="getStatusBadgeClass(project.status)">
                  {{ getStatusText(project.status) }}
                </span>
              </div>
              <p class="text-muted mb-3">
                {{ project.description }}
              </p>
              <div class="project-tech">
                <span v-for="tech in project.technologies" :key="tech" class="badge bg-light text-dark me-2 mb-1">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 更多项目提示 -->
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
                <div class="display-6 fw-bold text-primary">{{ completedProjectsCount }}</div>
                <div class="text-muted">已完成项目</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-success">{{ inProgressProjectsCount }}</div>
                <div class="text-muted">进行中项目</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-info">{{ totalParticipants }}</div>
                <div class="text-muted">参与成员</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="display-6 fw-bold text-warning">{{ plannedProjectsCount }}</div>
                <div class="text-muted">规划中项目</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { projects, type Project } from '@/data/projects';
import { computed } from 'vue';

// 计算项目统计
const completedProjectsCount = computed(() =>
  projects.filter(p => p.status === 'completed').length
);

const inProgressProjectsCount = computed(() =>
  projects.filter(p => p.status === 'in-progress').length
);

const plannedProjectsCount = computed(() =>
  projects.filter(p => p.status === 'planned').length
);

const totalParticipants = computed(() => {
  const allParticipants = projects.flatMap(p => p.participants);
  const uniqueParticipants = new Set(allParticipants);
  return uniqueParticipants.size;
});

// 状态徽章样式
const getStatusBadgeClass = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'badge bg-primary';
    case 'in-progress':
      return 'badge bg-success';
    case 'planned':
      return 'badge bg-secondary';
    default:
      return 'badge bg-secondary';
  }
};

// 状态文本
const getStatusText = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return '已完成';
    case 'in-progress':
      return '进行中';
    case 'planned':
      return '规划中';
    default:
      return '规划中';
  }
};
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

.project-tech .badge {
  font-size: 0.75rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}
</style>