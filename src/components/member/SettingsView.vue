<template>
    <div class="settings-container">
        <!-- 页面标题 -->
        <div class="row mb-4">
            <div class="col-12">
                <h4 class="text-primary mb-2">账户与系统设置</h4>
                <p class="text-muted mb-0">管理您的账户信息和系统偏好设置</p>
            </div>
        </div>

        <!-- 设置内容区域 -->
        <div class="row">
            <!-- 左侧：账户设置卡片 -->
            <div class="col-lg-8 mb-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-person-gear me-2"></i>账户设置
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- 用户信息展示 -->
                        <div class="user-info-section mb-4">
                            <div class="d-flex align-items-center mb-3">
                                <img :src="user?.avatar || 'https://cn1.anndfine.top/downloadfiles/kjcxs:avatar:avatar_default'"
                                    alt="头像" class="rounded-circle me-3" width="64" height="64" />
                                <div class="flex-grow-1">
                                    <h5 class="mb-1">{{ user?.name || '用户名' }}</h5>
                                    <div class="d-flex flex-wrap gap-2 text-muted small">
                                        <span class="badge bg-primary">{{ user?.role || '角色' }}</span>
                                        <span class="badge bg-secondary">{{ user?.department || '部门' }}</span>
                                        <span v-if="user?.lastLogin" class="badge bg-info">
                                            最后登录: {{ formatDate(user.lastLogin) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 快速操作按钮 -->
                        <div class="quick-actions mb-4">
                            <h6 class="text-muted mb-3">快速操作</h6>
                            <div class="d-grid gap-2 d-md-flex">
                                <button class="btn btn-outline-primary me-2" @click="switchToProfile">
                                    <i class="bi bi-person me-1"></i>编辑资料
                                </button>
                                <button class="btn btn-outline-secondary" @click="showExportModal">
                                    <i class="bi bi-download me-1"></i>导出数据
                                </button>
                            </div>
                        </div>

                        <!-- 账户安全区域 -->
                        <div class="security-section">
                            <h6 class="text-muted mb-3">账户安全</h6>
                            <div class="list-group">
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="bi bi-shield-check text-success me-2"></i>
                                        <span>登录状态</span>
                                    </div>
                                    <span class="badge bg-success">已登录</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="bi bi-clock-history text-info me-2"></i>
                                        <span>最后活动</span>
                                    </div>
                                    <small class="text-muted">{{ formatRelativeTime(user?.lastLogin) }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：系统设置和操作卡片 -->
            <div class="col-lg-4 mb-4">
                <!-- 系统设置卡片 -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-gear me-2"></i>系统设置
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- <SystemSettings /> -->
                    </div>
                </div>

                <!-- 危险操作卡片 -->
                <div class="card border-warning">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-exclamation-triangle me-2"></i>危险操作
                        </h5>
                    </div>
                    <div class="card-body">
                        <p class="small text-muted mb-3">请谨慎操作以下功能</p>
                        <div class="d-grid gap-2">
                            <!-- 退出登录按钮 -->
                            <button class="btn btn-outline-warning" @click="handleLogout" :disabled="logoutLoading">
                                <i class="bi bi-box-arrow-right me-1"></i>
                                {{ logoutLoading ? '退出中...' : '退出登录' }}
                            </button>

                            <!-- 删除账户按钮 -->
                            <button class="btn btn-outline-danger" @click="showDeleteAccountModal">
                                <i class="bi bi-trash me-1"></i>删除账户
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from './useAuth.ts'
import { showToast } from '@/utils/toast.ts'
// import SystemSettings from './SystemSettings.vue'

// 导入认证相关功能
const { logout } = useAuth()

// 定义props
interface user {
    id: number
    name?: string
    avatar?: string
    role?: string
    department?: string
    lastLogin?: string
    permissions?: string[]
}

const props = defineProps<{
    user: user | null
}>()

// 定义emits
const emit = defineEmits<{
    switchToProfile: []
    showExportModal: []
    showDeleteAccountModal: []
}>()

// 状态管理
const logoutLoading = ref(false)

// 方法定义
const handleLogout = async () => {
    logoutLoading.value = true
    showToast('info', '正在退出登录...');
    setTimeout(async () => {
        try {
            await logout()
            // 登出成功后的处理在父组件中完成
        } catch (error) {
            console.error('登出失败:', error)
        } finally {
            logoutLoading.value = false
            showToast('success', '欢迎下次使用');
        }
    }, 1500)
}

const switchToProfile = () => {
    emit('switchToProfile')
}

const showExportModal = () => {
    emit('showExportModal')
}

const showDeleteAccountModal = () => {
    emit('showDeleteAccountModal')
}

const formatDate = (dateString?: string) => {
    if (!dateString) return '未知'
    return new Date(dateString).toLocaleString('zh-CN')
}

const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '未知'

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`

    return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.settings-container {
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    border: none;
    border-radius: 12px;
}

.card-header {
    border-bottom: 1px solid #e9ecef;
    border-radius: 12px 12px 0 0 !important;
}

.user-info-section {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.quick-actions .btn {
    border-radius: 6px;
    font-weight: 500;
}

.security-section .list-group-item {
    border: none;
    border-bottom: 1px solid #e9ecef;
    padding: 0.75rem 1rem;
}

.security-section .list-group-item:last-child {
    border-bottom: none;
}

.btn {
    border-radius: 6px;
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge {
    font-size: 0.75em;
    font-weight: 500;
}

@media (max-width: 768px) {
    .settings-container {
        padding: 0 1rem;
    }

    .user-info-section {
        text-align: center;
    }

    .d-md-flex {
        flex-direction: column;
    }

    .me-2 {
        margin-right: 0 !important;
        margin-bottom: 0.5rem;
    }
}
</style>