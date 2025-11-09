// src/composables/useAuth.ts
import { ref, computed } from 'vue'
import { performLogin, fetchUserInfo, performLogout } from './authService'

interface User {
    id: number
    name: string
    avatar: string
    role: string
    department: string
    studentId: string
    lastLogin: string
    permissions: string[]
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    loading: boolean
    error: string | null
}

const authState = ref<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
})

export function useAuth() {
    // 检查登录状态
    const checkAuth = async (): Promise<boolean> => {
        authState.value.loading = true
        authState.value.error = null

        try {
            const result = await fetchUserInfo()

            if (result.success && result.data) {
                authState.value.isAuthenticated = true
                authState.value.user = result.data
                return true
            } else {
                authState.value.isAuthenticated = false
                authState.value.user = null
                authState.value.error = result.message || '未登录'
                return false
            }
        } catch (error) {
            console.error('检查认证状态失败:', error)
            authState.value.isAuthenticated = false
            authState.value.user = null
            authState.value.error = '网络错误'
            return false
        } finally {
            authState.value.loading = false
        }
    }

    // 登录
    const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
        // authState.value.loading = true
        authState.value.error = null

        try {
            const success = await performLogin(credentials)

            if (success) {
                // 登录成功，重新获取用户信息
                await checkAuth()
                return true
            } else {
                authState.value.error = '登录失败，请检查用户名和密码'
                // 登录失败时也检查一次认证状态，确保状态一致
                // await checkAuth()
                return false
            }
        } catch (error) {
            console.error('登录失败:', error)
            authState.value.error = error instanceof Error ? error.message : '登录失败'
            // 发生错误时也检查认证状态
            // await checkAuth()
            // return false
            throw error
        } finally {
            authState.value.loading = false
        }
    }

    // 登出
    const logout = async (): Promise<void> => {
        // authState.value.loading = true

        try {
            await performLogout()
        } catch (error) {
            console.error('登出失败:', error)
        } finally {
            authState.value.isAuthenticated = false
            authState.value.user = null
            authState.value.error = null
            authState.value.loading = false
        }
    }

    // 轮询检查登录状态
    const startPolling = (interval = 300000) => {
        return setInterval(checkAuth, interval)
    }

    // 清除错误
    const clearError = () => {
        authState.value.error = null
    }

    return {
        isAuthenticated: computed(() => authState.value.isAuthenticated),
        user: computed(() => authState.value.user),
        loading: computed(() => authState.value.loading),
        error: computed(() => authState.value.error),
        checkAuth,
        login,
        logout,
        startPolling,
        clearError
    }
}