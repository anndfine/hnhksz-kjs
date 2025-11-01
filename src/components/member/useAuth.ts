// src/components/member/useAuth.ts
import { ref, computed } from 'vue'

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
}

const authState = ref<AuthState>({
  isAuthenticated: false,
  user: null,
  loading: true
})

export function useAuth() {
  // 检查登录状态
  const checkAuth = async (): Promise<boolean> => {
    authState.value.loading = true
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // 携带cookie
      })
      
      const result = await response.json()
      
      if (result.success && result.data) {
        authState.value.isAuthenticated = true
        authState.value.user = result.data
        return true
      } else {
        authState.value.isAuthenticated = false
        authState.value.user = null
        return false
      }
    } catch (error) {
      console.error('检查认证状态失败:', error)
      authState.value.isAuthenticated = false
      authState.value.user = null
      return false
    } finally {
      authState.value.loading = false
    }
  }

  // 登录
  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })
      
      const result = await response.json()
      
      if (result.success) {
        await checkAuth() // 重新获取用户信息
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      authState.value.isAuthenticated = false
      authState.value.user = null
    }
  }

  // 轮询检查登录状态（可选）
  const startPolling = (interval = 300000) => { // 5分钟
    return setInterval(checkAuth, interval)
  }

  return {
    isAuthenticated: computed(() => authState.value.isAuthenticated),
    user: computed(() => authState.value.user),
    loading: computed(() => authState.value.loading),
    checkAuth,
    login,
    logout,
    startPolling
  }
}