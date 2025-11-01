<!-- src/components/member/LoginView.vue -->
<template>
    <div class="login-card">
        <div class="login-header">
            <i class="bi bi-person-circle login-icon"></i>
            <h2 class="login-title">科技社成员系统</h2>
            <p class="login-subtitle">请登录您的账户</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
            <div class="mb-3">
                <label for="username" class="form-label">学号/用户名</label>
                <input type="text" class="form-control" id="username" v-model="form.username" :disabled="loading"
                    required autocomplete="username">
            </div>

            <div class="mb-4">
                <label for="password" class="form-label">密码</label>
                <input type="password" class="form-control" id="password" v-model="form.password" :disabled="loading"
                    required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary w-100 login-btn" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? '登录中...' : '登录' }}
            </button>
        </form>

        <div v-if="error" class="alert alert-danger mt-3" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
        </div>

        <div class="login-footer mt-4">
            <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                遇到问题？请联系科技社技术支持
            </small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/components/member/useAuth.ts'

const { login } = useAuth()

const emit = defineEmits<{
    loginSuccess: []
}>()

const loading = ref(false)
const error = ref('')

const form = reactive({
    username: '',
    password: ''
})

const handleLogin = async () => {
    if (!form.username || !form.password) {
        error.value = '请输入用户名和密码'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const success = await login({
            username: form.username,
            password: form.password
        })

        if (success) {
            console.log("true")
            emit('loginSuccess')
        } else {
            error.value = '用户名或密码错误'
            return;
        }
    } catch (err) {
        error.value = '登录失败，请检查网络连接后重试'
        console.error('登录错误:', err)
    } finally {
        loading.value = false
    }
}
</script>

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