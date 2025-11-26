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
                            <div class="list-group mb-4">
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
                            <!-- 密码修改区域 -->
                            <div class="password-change-section mt-5">
                                <h6 class="text-muted mb-3">
                                    <i class="bi bi-key me-2"></i>修改密码
                                </h6>
                                <form @submit.prevent="handleChangePassword" class="password-form">
                                    <div class="row g-3">
                                        <!-- 旧密码 -->
                                        <div class="col-12">
                                            <label for="oldPassword" class="form-label small text-muted d-none">旧密码</label>
                                            <div class="input-group">
                                                <span class="input-group-text">
                                                    <i class="bi bi-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    id="oldPassword"
                                                    v-model="oldPassword"
                                                    placeholder="请输入当前密码"
                                                    required
                                                    :disabled="submitLoading"
                                                />
                                            </div>
                                        </div>

                                        <!-- 新密码 -->
                                        <div class="col-12">
                                            <label for="newPassword" class="d-none form-label small text-muted">新密码</label>
                                            <div class="input-group">
                                                <span class="input-group-text">
                                                    <i class="bi bi-lock-fill"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    id="newPassword"
                                                    v-model="newPassword"
                                                    placeholder="请输入新密码（至少8位）"
                                                    required
                                                    :disabled="submitLoading"
                                                    @input="checkPasswordStrength"
                                                />
                                            </div>
                                            <!-- 密码强度提示 -->
                                            <div v-if="newPassword.length > 0" class="mt-1">
                                                <div class="d-flex align-items-center">
                                                    <small class="text-muted me-2">密码强度:</small>
                                                    <div class="flex-grow-1">
                                                        <div class="progress" style="height: 6px;">
                                                            <div
                                                                class="progress-bar"
                                                                :class="passwordStrengthClass"
                                                                :style="{ width: passwordStrengthWidth }"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <small class="ms-2" :class="passwordStrengthTextClass">
                                                        {{ passwordStrengthText }}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 确认新密码 -->
                                        <div class="col-12">
                                            <label for="confirmPassword" class="d-none form-label small text-muted">确认新密码</label>
                                            <div class="input-group">
                                                <span class="input-group-text">
                                                    <i class="bi bi-lock-fill"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    id="confirmPassword"
                                                    v-model="confirmPassword"
                                                    placeholder="请再次输入新密码"
                                                    required
                                                    :disabled="submitLoading"
                                                />
                                            </div>
                                            <!-- 密码不一致提示 -->
                                            <div v-if="confirmPassword.length > 0 && newPassword !== confirmPassword" class="mt-1">
                                                <small class="text-danger">两次输入的密码不一致</small>
                                            </div>
                                        </div>

                                        <!-- 验证码（iframe留空，后续可嵌入） -->
                                        <div class="col-12">
                                            <label class="form-label small text-muted">确认你是人类</label>
                                            <div class="input-group d-none">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    v-model="verifyCode"
                                                    placeholder="请输入验证码"
                                                    required
                                                    :disabled="submitLoading"
                                                />
                                                <span class="input-group-text" style="cursor: pointer;" @click="refreshVerifyCode" :disabled="submitLoading">
                                                    <i class="bi bi-arrow-clockwise"></i> 刷新
                                                </span>
                                            </div>
                                            <!-- 验证码iframe容器（留空，后续可嵌入验证码组件） -->
                                            <!-- 接入CloudFlare 或自定义页面 -->
                                            <div class="mt-2 bg-light p-3 rounded" style="min-height: 8px; display: flex; align-items: center; justify-content: center;">
                                                <iframe
                                                    :src="verifyCodeIframeUrl"
                                                    frameborder="0"
                                                    width="100%"
                                                    height="8"
                                                    style="border-radius: 4px;"
                                                    :disabled="submitLoading"
                                                ></iframe>
                                            </div>
                                        </div>

                                        <!-- 提交按钮 -->
                                        <div class="col-12">
                                            <button
                                                type="submit"
                                                class="btn btn-primary w-100"
                                                :disabled="submitLoading || !isFormValid"
                                            >
                                                <i class="bi bi-save me-1"></i>
                                                {{ submitLoading ? '提交中...' : '确认修改' }}
                                            </button>
                                        </div>
                                    </div>
                                </form>
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
                            <button class="d-none btn btn-outline-danger" @click="showDeleteAccountModal">
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
import { ref, computed } from 'vue'
import { useAuth } from './useAuth.ts'
import { showToast } from '@/utils/toast.ts'
// import SystemSettings from './SystemSettings.vue'

// 导入认证相关功能
const { logout } = useAuth()

// 定义props
interface User {
    id: number
    name?: string
    avatar?: string
    role?: string
    department?: string
    lastLogin?: string
    permissions?: string[]
}

const props = defineProps<{
    user: User | null
}>()

// 定义emits
const emit = defineEmits<{
    switchToProfile: []
    showExportModal: []
    showDeleteAccountModal: []
}>()

// 状态管理
const logoutLoading = ref(false)
const submitLoading = ref(false)

// 方法定义
// 密码修改表单状态
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const verifyCode = ref('')
const verifyCodeIframeUrl = ref('') // 验证码iframe地址，后续可配置

// 密码强度相关状态
const passwordStrength = ref(0) // 0-3：弱、中、强、极强
const passwordStrengthText = ref('')
const passwordStrengthClass = ref('')
const passwordStrengthWidth = ref('0%')
const passwordStrengthTextClass = ref('')

// 初始化验证码（实际项目中替换为真实的验证码接口）
const refreshVerifyCode = () => {
    // 这里只是模拟刷新，实际项目中应该请求新的验证码地址
    verifyCodeIframeUrl.value = `about:blank?t=${Date.now()}`
    verifyCode.value = ''
}

// 检查密码强度
const checkPasswordStrength = () => {
    const password = newPassword.value
    let strength = 0
    
    if (password.length >= 8) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    
    passwordStrength.value = strength
    
    // 根据强度设置样式和文本
    switch(strength) {
        case 0:
            passwordStrengthText.value = '未输入'
            passwordStrengthClass.value = 'bg-secondary'
            passwordStrengthWidth.value = '0%'
            passwordStrengthTextClass.value = 'text-secondary'
            break
        case 1:
            passwordStrengthText.value = '弱'
            passwordStrengthClass.value = 'bg-danger'
            passwordStrengthWidth.value = '25%'
            passwordStrengthTextClass.value = 'text-danger'
            break
        case 2:
            passwordStrengthText.value = '中'
            passwordStrengthClass.value = 'bg-warning'
            passwordStrengthWidth.value = '50%'
            passwordStrengthTextClass.value = 'text-warning'
            break
        case 3:
            passwordStrengthText.value = '强'
            passwordStrengthClass.value = 'bg-info'
            passwordStrengthWidth.value = '75%'
            passwordStrengthTextClass.value = 'text-info'
            break
        case 4:
            passwordStrengthText.value = '极强'
            passwordStrengthClass.value = 'bg-success'
            passwordStrengthWidth.value = '100%'
            passwordStrengthTextClass.value = 'text-success'
            break
    }
}

// 表单验证
const isFormValid = computed(() => {
    return (
        oldPassword.value.trim() !== '' &&
        newPassword.value.trim() !== '' &&
        newPassword.value.length >= 8 &&
        confirmPassword.value.trim() !== '' &&
        newPassword.value === confirmPassword.value &&
        verifyCode.value.trim() !== ''
    )
})

// 处理密码修改
const handleChangePassword = async () => {
    if (!isFormValid.value) return
    
    submitLoading.value = true
    showToast('info', '正在提交修改...')
    
    try {
        // 实际项目中替换为真实的密码修改接口
        console.log('提交密码修改：', {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            verifyCode: verifyCode.value
        })
        
        // 模拟接口请求延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 密码修改成功后的处理
        showToast('success', '密码修改成功！请重新登录')
        
        // 重置表单
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
        verifyCode.value = ''
        passwordStrength.value = 0
        
        // 可选：修改成功后自动退出登录，让用户重新登录
        // setTimeout(() => {
        //     handleLogout()
        // }, 1000)
    } catch (error) {
        console.error('密码修改失败:', error)
        showToast('error', '密码修改失败，请稍后重试')
    } finally {
        submitLoading.value = false
        refreshVerifyCode() // 刷新验证码
    }
}

// 处理退出登录
const handleLogout = async () => {
    logoutLoading.value = true
    showToast('info', '正在退出登录...');
    setTimeout(async () => {
        try {
            await logout()
            // 登出成功后的处理在父组件中完成
        } catch (error) {
            console.error('登出失败:', error)
            showToast('error', '登出失败，请稍后重试')
        } finally {
            logoutLoading.value = false
            showToast('success', '欢迎下次使用');
        }
    }, 1500)
}

// 其他方法
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

// 初始化验证码
refreshVerifyCode()
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