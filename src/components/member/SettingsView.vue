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

              <!-- 新增：修改邮箱和密码的触发按钮 -->
              <div class="d-grid gap-2 d-md-flex mb-4">
                <button class="btn btn-outline-primary" @click="openEmailModal">
                  <i class="bi bi-envelope me-1"></i>修改邮箱
                </button>
                <button class="btn btn-outline-primary" @click="openPasswordModal">
                  <i class="bi bi-key me-1"></i>修改密码
                </button>
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

    <!-- 新增：修改邮箱模态框 -->
    <div class="modal fade" ref="emailModal" tabindex="-1" aria-labelledby="emailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="emailModalLabel">修改邮箱</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleChangeEmail">
              <div class="row g-3">
                <!-- 原密码验证 -->
                <div class="col-12">
                  <label for="emailOldPassword" class="form-label">原密码</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input type="password" class="form-control" id="emailOldPassword" v-model="emailForm.oldPassword"
                      placeholder="请输入原密码" required :disabled="submitLoading" />
                  </div>
                </div>

                <!-- 新邮箱 -->
                <div class="col-12">
                  <label for="newEmail" class="form-label">新邮箱</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input type="email" class="form-control" id="newEmail" v-model="emailForm.newEmail"
                      placeholder="请输入新邮箱" required :disabled="submitLoading" />
                  </div>
                </div>

                <!-- 验证码 -->
                <div class="col-12">
                  <label for="emailVerifyCode" class="form-label">验证码</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="emailVerifyCode" v-model="emailForm.verifyCode"
                      placeholder="请输入验证码" required :disabled="submitLoading" />
                    <span class="input-group-text" style="cursor: pointer;" @click="refreshEmailVerifyCode"
                      :disabled="submitLoading">
                      <i class="bi bi-arrow-clockwise"></i> 刷新
                    </span>
                  </div>
                  <!-- 验证码图片（示例） -->
                  <div class="mt-2">
                    <img :src="emailVerifyCodeUrl" alt="验证码" class="img-thumbnail" style="cursor: pointer;"
                      @click="refreshEmailVerifyCode">
                  </div>
                </div>

                <!-- 提交按钮 -->
                <div class="col-12">
                  <button type="submit" class="btn btn-primary w-100" :disabled="submitLoading || !isEmailFormValid">
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

    <!-- 新增：修改密码模态框 -->
    <div class="modal fade" ref="passwordModal" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="passwordModalLabel">修改密码</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleChangePassword">
              <div class="row g-3">
                <!-- 旧密码 -->
                <div class="col-12">
                  <label for="oldPassword" class="form-label">旧密码</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input type="password" class="form-control" id="oldPassword" v-model="passwordForm.oldPassword"
                      placeholder="请输入当前密码" required :disabled="submitLoading" />
                  </div>
                </div>

                <!-- 新密码 -->
                <div class="col-12">
                  <label for="newPassword" class="form-label">新密码</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="newPassword" v-model="passwordForm.newPassword"
                      placeholder="请输入新密码（至少8位）" required :disabled="submitLoading" @input="checkPasswordStrength" />
                  </div>
                  <!-- 密码强度提示 -->
                  <div v-if="passwordForm.newPassword.length > 0" class="mt-1">
                    <div class="d-flex align-items-center">
                      <small class="text-muted me-2">密码强度:</small>
                      <div class="flex-grow-1">
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar" :class="passwordStrengthClass"
                            :style="{ width: passwordStrengthWidth }"></div>
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
                  <label for="confirmPassword" class="form-label">确认新密码</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="confirmPassword"
                      v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码" required
                      :disabled="submitLoading" />
                  </div>
                  <!-- 密码不一致提示 -->
                  <div
                    v-if="passwordForm.confirmPassword.length > 0 && passwordForm.newPassword !== passwordForm.confirmPassword"
                    class="mt-1">
                    <small class="text-danger">两次输入的密码不一致</small>
                  </div>
                </div>

                <!-- 验证码 -->
                <div class="col-12">
                  <label for="passwordVerifyCode" class="form-label">验证码</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="passwordVerifyCode" v-model="passwordForm.verifyCode"
                      placeholder="请输入验证码" required :disabled="submitLoading" />
                    <span class="input-group-text" style="cursor: pointer;" @click="refreshPasswordVerifyCode"
                      :disabled="submitLoading">
                      <i class="bi bi-arrow-clockwise"></i> 刷新
                    </span>
                  </div>
                  <!-- 验证码图片（示例） -->
                  <div class="mt-2">
                    <img :src="passwordVerifyCodeUrl" alt="验证码" class="img-thumbnail" style="cursor: pointer;"
                      @click="refreshPasswordVerifyCode">
                  </div>
                </div>

                <!-- 提交按钮 -->
                <div class="col-12">
                  <button type="submit" class="btn btn-primary w-100" :disabled="submitLoading || !isPasswordFormValid">
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
</template>

<script setup lang="ts">
// 声明全局 bootstrap 变量，解决 TS 类型报错
declare const bootstrap: any;
import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth.ts'
import { showToast } from '@/utils/toast.ts'
// 无需 import { Modal } from 'bootstrap'，直接用全局变量

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

// 新增：修改邮箱表单状态
const emailForm = ref({
  oldPassword: '',
  newEmail: '',
  verifyCode: ''
})

// 新增：修改密码表单状态
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  verifyCode: ''
})

// 新增：验证码图片地址（示例）
const emailVerifyCodeUrl = ref('')
const passwordVerifyCodeUrl = ref('')

// 密码强度相关状态
const passwordStrength = ref(0)
const passwordStrengthText = ref('')
const passwordStrengthClass = ref('')
const passwordStrengthWidth = ref('0%')
const passwordStrengthTextClass = ref('')

// 模态框实例引用（修复：使用正确的 ref 名称）
const emailModalRef = ref<HTMLElement | null>(null);
const passwordModalRef = ref<HTMLElement | null>(null);

// 模态框实例
const emailModal = ref<any>(null);
const passwordModal = ref<any>(null);

// 模态框实例（修复：使用不同的变量名）
const emailModalInstance = ref<any>(null);
const passwordModalInstance = ref<any>(null);

// 初始化模态框
onMounted(() => {
  // 添加延迟确保 Bootstrap 完全加载
  setTimeout(() => {
    // 检查 Bootstrap 是否已加载
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      console.error('Bootstrap 未加载或 Modal 组件不可用，请检查 CDN 引入')
      showToast('error', '系统组件加载失败，请刷新页面')
      return
    }

    // 调试信息
    console.log('Bootstrap Modal 可用:', bootstrap.Modal)
    console.log('emailModal DOM 元素:', emailModal.value)
    console.log('passwordModal DOM 元素:', passwordModal.value)

    // 初始化模态框实例
    if (emailModal.value) {
      try {
        emailModalInstance.value = new bootstrap.Modal(emailModal.value, {
          backdrop: 'static',
          keyboard: false
        });
        console.log('邮箱模态框初始化成功:', emailModalInstance.value)
      } catch (error) {
        console.error('邮箱模态框初始化失败:', error)
      }
    }

    if (passwordModal.value) {
      try {
        passwordModalInstance.value = new bootstrap.Modal(passwordModal.value, {
          backdrop: 'static',
          keyboard: false
        });
        console.log('密码模态框初始化成功:', passwordModalInstance.value)
      } catch (error) {
        console.error('密码模态框初始化失败:', error)
      }
    }

    // 刷新验证码
    refreshEmailVerifyCode()
    refreshPasswordVerifyCode()
  }, 100) // 延迟 100ms 确保 Bootstrap 加载完成
})

// 新增：打开修改邮箱模态框
const openEmailModal = () => {
  if (!emailModalInstance.value) {
    console.error('邮箱模态框实例未初始化:', emailModalInstance.value)
    showToast('error', '模态框未初始化，请刷新页面')
    return
  }

  // 检查 show 方法是否存在
  if (typeof emailModalInstance.value.show !== 'function') {
    console.error('emailModalInstance.show 不是函数:', emailModalInstance.value)
    showToast('error', '模态框功能异常，请刷新页面')
    return
  }

  try {
    emailModalInstance.value.show()
    console.log('邮箱模态框成功打开')
  } catch (error) {
    console.error('打开邮箱模态框失败:', error)
    showToast('error', '打开模态框失败，请刷新页面')
  }
}

// 新增：打开修改密码模态框
const openPasswordModal = () => {
  if (!passwordModalInstance.value) {
    console.error('密码模态框实例未初始化:', passwordModalInstance.value)
    showToast('error', '模态框未初始化，请刷新页面')
    return
  }

  // 检查 show 方法是否存在
  if (typeof passwordModalInstance.value.show !== 'function') {
    console.error('passwordModalInstance.show 不是函数:', passwordModalInstance.value)
    showToast('error', '模态框功能异常，请刷新页面')
    return
  }

  try {
    passwordModalInstance.value.show()
    console.log('密码模态框成功打开')
  } catch (error) {
    console.error('打开密码模态框失败:', error)
    showToast('error', '打开模态框失败，请刷新页面')
  }
}

// 新增：关闭模态框并重置表单
const closeEmailModal = () => {
  if (emailModalInstance.value) {
    emailModalInstance.value.hide()
  }
  resetEmailForm()
}

const closePasswordModal = () => {
  if (passwordModalInstance.value) {
    passwordModalInstance.value.hide()
  }
  resetPasswordForm()
}

// 新增：重置表单
const resetEmailForm = () => {
  emailForm.value = {
    oldPassword: '',
    newEmail: '',
    verifyCode: ''
  }
  refreshEmailVerifyCode()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    verifyCode: ''
  }
  passwordStrength.value = 0
  refreshPasswordVerifyCode()
}

// 新增：刷新验证码（示例）
const refreshEmailVerifyCode = () => {
  // 实际项目中替换为真实的验证码接口
  emailVerifyCodeUrl.value = `https://picsum.photos/200/80?random=${Date.now()}`
  emailForm.value.verifyCode = ''
}

const refreshPasswordVerifyCode = () => {
  // 实际项目中替换为真实的验证码接口
  passwordVerifyCodeUrl.value = `https://picsum.photos/200/80?random=${Date.now()}`
  passwordForm.value.verifyCode = ''
}

// 检查密码强度
const checkPasswordStrength = () => {
  const password = passwordForm.value.newPassword
  let strength = 0

  if (password.length >= 8) strength++
  if (password.match(/[A-Z]/)) strength++
  if (password.match(/[0-9]/)) strength++
  if (password.match(/[^A-Za-z0-9]/)) strength++

  passwordStrength.value = strength

  // 根据强度设置样式和文本
  switch (strength) {
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

// 新增：邮箱表单验证
const isEmailFormValid = computed(() => {
  return (
    emailForm.value.oldPassword.trim() !== '' &&
    emailForm.value.newEmail.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.value.newEmail) &&
    emailForm.value.verifyCode.trim() !== ''
  )
})

// 密码表单验证
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.oldPassword.trim() !== '' &&
    passwordForm.value.newPassword.trim() !== '' &&
    passwordForm.value.newPassword.length >= 8 &&
    passwordForm.value.confirmPassword.trim() !== '' &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordForm.value.verifyCode.trim() !== ''
  )
})

// 新增：处理修改邮箱
const handleChangeEmail = async () => {
  if (!isEmailFormValid.value) return

  submitLoading.value = true
  showToast('info', '正在提交修改...')

  try {
    // 实际项目中替换为真实的修改邮箱接口
    console.log('提交邮箱修改：', {
      oldPassword: emailForm.value.oldPassword,
      newEmail: emailForm.value.newEmail,
      verifyCode: emailForm.value.verifyCode
    })

    // 模拟接口请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 修改成功后的处理
    showToast('success', '邮箱修改成功！请重新登录')
    closeEmailModal()

    // 可选：修改成功后自动退出登录
    // setTimeout(() => {
    //   handleLogout()
    // }, 1000)
  } catch (error) {
    console.error('邮箱修改失败:', error)
    showToast('error', '邮箱修改失败，请稍后重试')
  } finally {
    submitLoading.value = false
  }
}

// 处理修改密码
const handleChangePassword = async () => {
  if (!isPasswordFormValid.value) return

  submitLoading.value = true
  showToast('info', '正在提交修改...')

  try {
    // 实际项目中替换为真实的密码修改接口
    console.log('提交密码修改：', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
      verifyCode: passwordForm.value.verifyCode
    })

    // 模拟接口请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 密码修改成功后的处理
    showToast('success', '密码修改成功！请重新登录')
    closePasswordModal()

    // 可选：修改成功后自动退出登录
    // setTimeout(() => {
    //   handleLogout()
    // }, 1000)
  } catch (error) {
    console.error('密码修改失败:', error)
    showToast('error', '密码修改失败，请稍后重试')
  } finally {
    submitLoading.value = false
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
</script>

<style scoped>
/* 模态框标题样式 */
.modal-title {
  font-weight: 600;
  color: #0d6efd;
}

/* 验证码图片样式 */
.img-thumbnail {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.25rem;
  max-width: 100%;
  height: auto;
}

/* 模态框按钮样式 */
.modal-footer .btn {
  margin-left: 0.5rem;
}
</style>