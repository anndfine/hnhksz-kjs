<template>
    <div class="row g-4">
        <!-- 左侧功能卡片 -->
        <div class="col-lg-8">
            <div class="row g-3">
                <!-- 功能卡片 -->
                <div class="col-md-6" @click="$emit('tag-change', 'live')">
                    <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                        <div class="card-body text-center p-4">
                            <i class="bi bi-broadcast display-4 text-primary mb-3"></i>
                            <h6 class="card-title">查看直播</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-6" @click="$emit('tag-change', 'video')">
                    <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                        <div class="card-body text-center p-4">
                            <i class="bi bi-play-btn display-4 text-success mb-3"></i>
                            <h6 class="card-title">视频回放</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-6" @click="$emit('navigate', '/member')">
                    <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                        <div class="card-body text-center p-4">
                            <i class="bi bi-people display-4 text-info mb-3"></i>
                            <h6 class="card-title">成员系统</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-6" @click="$emit('navigate', '/help')">
                    <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                        <div class="card-body text-center p-4">
                            <i class="bi bi-book display-4 text-warning mb-3"></i>
                            <h6 class="card-title">使用指南</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧用户信息栏 -->
        <div class="col-lg-4">
            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white">
                    <h5 class="card-title mb-0">
                        <i class="bi bi-person-circle me-2"></i>用户信息
                    </h5>
                </div>
                <div class="card-body text-center p-0">
                    <div v-if="!isAuthenticated" class="py-4 px-3">
                        <i class="bi bi-person-x display-4 text-muted mb-3"></i>
                        <h6 class="text-muted">未登录</h6>
                        <p class="small text-muted mb-3">请登录以查看个人信息</p>
                        <a href="/member" class="btn btn-primary">登录</a>
                    </div>
                    <div v-else class="p-3">
                        <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                                <img v-if="user?.avatar" :src="user.avatar" class="avatar rounded-circle border"
                                    alt="用户头像" style="width: 60px; height: 60px; object-fit: cover;">
                                <div v-else
                                    class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                                    style="width: 60px; height: 60px;">
                                    <i class="bi bi-person-fill fs-4"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3 text-start">
                                <h6 class="mb-1 fw-bold">{{ user?.name || '用户' }}</h6>
                                <span class="badge bg-secondary">{{ user?.role || '成员' }}</span>
                                <div class="small text-muted mt-1">
                                    <i class="bi bi-clock me-1"></i>{{ formatLastLogin(user?.lastLogin) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/components/member/useAuth.ts'

const { isAuthenticated, user } = useAuth()

// 事件定义
defineEmits<{
    (e: 'tag-change', tab: string): void
    (e: 'navigate', path: string): void
}>()

// 辅助函数
const formatLastLogin = (lastLogin?: string) => lastLogin ? new Date(lastLogin).toLocaleString('zh-CN') : '首次登录'
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1) !important;
}

.card {
    border-radius: 12px;
    border: 1px solid #333;
}

.card-header {
    border-radius: 12px 12px 0 0 !important;
}

.btn {
    border-radius: 6px;
}
</style>