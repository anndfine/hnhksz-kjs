<!-- src/components/member/LoginView.vue -->
<template>
    <div class="login-card">
        <div class="login-header">
            <i class="bi bi-person-circle login-icon"></i>
            <h2 class="login-title">科技社成员系统</h2>
            <p class="login-subtitle">请登录</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
            <div class="mb-3">
                <label for="username" class="form-label">邮箱</label>
                <input type="text" class="form-control" id="username" v-model="form.username" :disabled="localLoading"
                    required autocomplete="username">
            </div>

            <div class="mb-4">
                <label for="password" class="form-label">密码</label>
                <input type="password" class="form-control" id="password" v-model="form.password"
                    :disabled="localLoading" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary w-100 login-btn" :disabled="localLoading">
                <span v-if="localLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ localLoading ? '登录中...' : '登录' }}
            </button>
        </form>

        <!-- 集成防护验证组件 -->
        <AnubisShieldModal ref="shieldModal" @verified="onShieldVerified" @error="onShieldError"
            @cancel="onShieldCancel" />

        <div v-if="localError" class="alert alert-danger mt-3" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ localError }}
        </div>

        <div class="login-footer mt-4">
            <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                遇到问题？请<a href="https://yt437700.top" target="_blank" class="text-decoration-none">联系管理员获得技术支持</a>
            </small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/components/member/useAuth.ts'
// import AnubisShieldModal from './AnubisShieldModal.vue'

const { login, error: authError } = useAuth()
// const shieldModal = ref<InstanceType<typeof AnubisShieldModal>>()

const emit = defineEmits<{
    loginSuccess: []
}>()

const localLoading = ref(false)
const localError = ref('')

const form = reactive({
    username: '',
    password: ''
})

// 存储验证结果
let verificationResult: { challenge: string; response: string; encryptedPassword: string } | null = null

const onShieldVerified = (result: { challenge: string; response: string; encryptedPassword: string }) => {
    verificationResult = result
    // 验证成功后执行实际登录
    executeLogin()
}

const onShieldError = (error: string) => {
    localError.value = `安全验证失败: ${error}`
    localLoading.value = false
}

const onShieldCancel = () => {
    localLoading.value = false
    verificationResult = null
}

const executeLogin = async () => {
    try {
        // 使用验证结果进行登录
        const success = await login({
            username: form.username,
            password: verificationResult!.encryptedPassword, // 使用加密后的密码
            challenge: verificationResult!.challenge,
            response: verificationResult!.response
        })

        if (success) {
            console.log("登录成功")
            emit('loginSuccess')
        } else {
            throw new Error("用户名或密码错误")
        }
    } catch (err) {
        console.error('登录过程出错:', err)
        localError.value = `${err || '未知错误'}`
    } finally {
        localLoading.value = false
        verificationResult = null
    }
}

const handleLogin = async () => {
    if (!form.username || !form.password) {
        localError.value = '请输入用户名和密码'
        return
    }

    localLoading.value = true
    localError.value = ''
    verificationResult = null

    // try {
    //     // 显示防护验证Modal
    //     if (shieldModal.value) {
    //         shieldModal.value.show(form.username, form.password)
    //     } else {
    //         throw new Error('安全验证组件加载失败')
    //     }
    // } catch (err) {
    //     console.error('启动安全验证失败:', err)
    //     localError.value = `安全验证启动失败: ${err}`
    //     localLoading.value = false
    // }
}

onMounted(() => {
    console.log('Anubis防护验证已集成')
})
</script>

<!-- 保持原有样式不变 -->
<style scoped>
.login-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
    margin: 20px;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-icon {
    font-size: 3rem;
    color: #1e3c72;
    margin-bottom: 16px;
}

.login-title {
    color: #1e3c72;
    font-weight: 700;
    margin-bottom: 8px;
}

.login-subtitle {
    color: #6c757d;
    margin-bottom: 0;
}

.login-form .form-control {
    padding: 12px 16px;
    border-radius: 8px;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.login-form .form-control:focus {
    border-color: #1e3c72;
    box-shadow: 0 0 0 0.2rem rgba(30, 60, 114, 0.25);
}

.login-btn {
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    border: none;
    transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(30, 60, 114, 0.4);
}

.login-footer {
    text-align: center;
    border-top: 1px solid #e9ecef;
    padding-top: 20px;
}
</style>