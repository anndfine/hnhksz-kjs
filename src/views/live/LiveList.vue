<template>
    <div class="container-fluid">
        <div class="live-list-section mt-4" v-if="!loading && !error && liveList.length > 0">
            <h3><i class="bi bi-list-ul me-2"></i>直播列表</h3>
            <div class="live-list row g-3">
                <div v-for="live in liveList" :key="live.id" class="col-md-6 col-lg-4"
                    @click="$emit('select-live', live)" style="cursor: pointer;">
                    <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white"
                        :class="{ 'border-primary': currentLive?.id === live.id }">
                        <img v-if="live.thumbnail" :src="live.thumbnail" class="card-img-top" :alt="live.title">
                        <div class="card-body">
                            <h5 class="card-title">{{ live.title }}</h5>
                            <p class="card-text">{{ live.description }}</p>
                            <div class="d-flex justify-content-between small text-muted">
                                <span><i class="bi bi-eye"></i> {{ live.viewers || 0 }}</span>
                                <span>{{ formatTime(live.updatedAt || '') }}</span>
                            </div>
                            <span class="badge mt-2" :class="{
                                'bg-success': live.status === 'live',
                                'bg-warning': live.status === 'upcoming',
                                'bg-secondary': live.status === 'offline'
                            }">
                                {{ getStatusText(live.status || '') || "状态不明" }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">正在获取直播列表...</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="error" class="alert alert-warning mt-3 text-center">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
            <button class="btn btn-sm btn-primary ms-2" @click="$emit('refresh')">
                <i class="bi bi-arrow-clockwise me-1"></i>重试
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { LiveStream } from '@/views/live/LiveLayout.vue'

// Props定义
interface Props {
    liveList: LiveStream[]
    loading: boolean
    error: string
    currentLive: LiveStream | null
}

const props = defineProps<Props>()

// 事件定义
defineEmits<{
    (e: 'select-live', live: LiveStream): void
    (e: 'refresh'): void
}>()

// 辅助函数
const getStatusText = (status: string) => {
    switch (status) {
        case 'live': return '直播中'
        case 'upcoming': return '即将开始'
        case 'end': return '已结束'
        default: return '不明'
    }
}

const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
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

.btn {
    border-radius: 6px;
}
</style>