<!-- src/components/common/Toast.vue -->
<template>
    <transition-group name="toast" tag="div" class="toast-container">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast-item', `toast-${toast.type}`]"
            @click="removeToast(toast.id)">
            <div class="toast-icon">
                <i :class="getIconClass(toast.type)"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">{{ getTitle(toast.type) }}</div>
                <div class="toast-message">{{ toast.message }}</div>
            </div>
            <button class="toast-close" @click.stop="removeToast(toast.id)">
                <i class="bi bi-x"></i>
            </button>
        </div>
    </transition-group>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Toast {
    id: number
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
    timestamp: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

const getIconClass = (type: string) => {
    const icons = {
        'success': 'bi bi-check-circle-fill',
        'error': 'bi bi-exclamation-circle-fill',
        'warning': 'bi bi-exclamation-triangle-fill',
        'info': 'bi bi-info-circle-fill'
    }
    return icons[type as keyof typeof icons]
}

const getTitle = (type: string) => {
    const titles = {
        'success': '成功',
        'error': '错误',
        'warning': '警告',
        'info': '提示'
    }
    return titles[type as keyof typeof titles]
}

const addToast = (type: Toast['type'], message: string, duration: number = 5000) => {
    const id = toastId++
    const toast: Toast = {
        id,
        type,
        message,
        duration,
        timestamp: Date.now()
    }

    toasts.value.push(toast)

    if (duration > 0) {
        setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    return id
}

const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
        toasts.value.splice(index, 1)
    }
}

const clearToasts = () => {
    toasts.value = []
}

// 暴露方法给全局使用
defineExpose({
    addToast,
    removeToast,
    clearToasts
})
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast-item {
    min-width: 320px;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    pointer-events: all;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 4px solid #ccc;
}

.toast-item:hover {
    transform: translateX(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-success {
    border-left-color: #28a745;
    background: linear-gradient(135deg, #f8fff9, #ffffff);
}

.toast-error {
    border-left-color: #dc3545;
    background: linear-gradient(135deg, #fff8f8, #ffffff);
}

.toast-warning {
    border-left-color: #ffc107;
    background: linear-gradient(135deg, #fffbf0, #ffffff);
}

.toast-info {
    border-left-color: #17a2b8;
    background: linear-gradient(135deg, #f0f9ff, #ffffff);
}

.toast-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 2px;
}

.toast-success .toast-icon {
    color: #28a745;
}

.toast-error .toast-icon {
    color: #dc3545;
}

.toast-warning .toast-icon {
    color: #ffc107;
}

.toast-info .toast-icon {
    color: #17a2b8;
}

.toast-content {
    flex: 1;
    min-width: 0;
}

.toast-title {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 4px;
    color: #333;
}

.toast-message {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.4;
}

.toast-close {
    background: none;
    border: none;
    font-size: 1rem;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
}

.toast-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #666;
}

/* 入场动画 */
.toast-enter-active {
    animation: slideInRight 0.3s ease;
}

.toast-leave-active {
    animation: slideOutRight 0.3s ease;
}

.toast-move {
    transition: transform 0.3s ease;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .toast-container {
        /* left: 10px; */
        right: 10px;
        top: 10px;
    }

    .toast-item {
        min-width: unset;
        width: 100%;
    }
}
</style>