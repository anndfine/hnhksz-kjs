<!-- src/components/member/AddMemberView.vue -->
<template>
    <div class="add-member-view">
        <!-- 页面头部 -->
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex align-items-center mb-3">
                        <h1 class="page-title mb-0">
                            <i class="bi bi-person-plus text-primary me-2"></i>
                            添加新成员
                        </h1>
                    </div>
                    <p class="text-muted">填写新成员的基本信息，系统将自动为其创建账户</p>
                </div>
            </div>

            <!-- 添加成员表单 -->
            <div class="row">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-transparent border-bottom">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-person-badge text-primary me-2"></i>
                                成员基本信息
                            </h5>
                        </div>
                        <div class="card-body">
                            <!-- 成功提示 -->
                            <div v-if="successMessage" class="alert alert-success d-flex align-items-center"
                                role="alert">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                {{ successMessage }}
                                <button type="button" class="btn-close ms-auto" @click="successMessage = ''"></button>
                            </div>

                            <!-- 错误提示 -->
                            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                {{ errorMessage }}
                                <button type="button" class="btn-close ms-auto" @click="errorMessage = ''"></button>
                            </div>

                            <form @submit.prevent="submitForm">
                                <div class="row">
                                    <!-- 姓名 -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">姓名</label>
                                        <input type="text" class="form-control" v-model="memberForm.name"
                                            :class="{ 'is-invalid': errors.name }" placeholder="请输入成员姓名" required>
                                        <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                                    </div>

                                    <!-- 邮箱 -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">邮箱</label>
                                        <input type="email" class="form-control" v-model="memberForm.email"
                                            :class="{ 'is-invalid': errors.email }" placeholder="请输入邮箱地址" required>
                                        <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                                    </div>

                                    <!-- 部门 -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">部门</label>
                                        <select class="form-select" v-model="memberForm.department">
                                            <option value="">请选择部门（可选）</option>
                                            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- 角色 -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">角色</label>
                                        <select class="form-select" v-model="memberForm.role">
                                            <option value="member">普通成员</option>
                                            <option value="admin">管理员</option>
                                            <option value="intern">实习生</option>
                                        </select>
                                    </div>

                                    <!-- 备注 -->
                                    <div class="col-12 mb-4">
                                        <label class="form-label">备注</label>
                                        <textarea class="form-control" rows="3" v-model="memberForm.notes"
                                            placeholder="可填写成员的特别说明或备注信息（可选）"></textarea>
                                    </div>
                                </div>

                                <!-- 表单操作按钮 -->
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                                        <i class="bi bi-arrow-clockwise me-1"></i>重置
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                        <template v-if="isSubmitting">
                                            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                                            提交中...
                                        </template>
                                        <template v-else>
                                            <i class="bi bi-check-lg me-1"></i>添加成员
                                        </template>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- 侧边栏提示 -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-transparent border-bottom">
                            <h6 class="card-title mb-0">
                                <i class="bi bi-info-circle text-info me-2"></i>
                                添加说明
                            </h6>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0">
                                <li class="mb-2">
                                    <small class="text-muted">
                                        <i class="bi bi-check text-success me-1"></i>
                                        仅姓名和邮箱为必填项
                                    </small>
                                </li>
                                <li class="mb-2">
                                    <small class="text-muted">
                                        <i class="bi bi-check text-success me-1"></i>
                                        系统将自动为成员生成初始密码
                                    </small>
                                </li>
                                <li class="mb-2">
                                    <small class="text-muted">
                                        <i class="bi bi-check text-success me-1"></i>
                                        添加成功后，成员会收到通知邮件
                                    </small>
                                </li>
                                <li>
                                    <small class="text-muted">
                                        <i class="bi bi-check text-success me-1"></i>
                                        其他信息可在管理页面中补充
                                    </small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { apinodes } from '@/data/apinodes'
import { showToast } from '@/utils/toast'
import { computeChallenge } from '@/utils/ComputeChallenge'

// 定义组件接口
interface Props {
    user?: any
}

interface Emits {
    (e: 'tabChange', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 部门列表
const departments = ['技术部', '宣传部', '策划部', '外联部', '组织部', '财务部']

// 表单数据（移除studentNo字段）
const memberForm = reactive({
    name: '',
    department: '',
    role: 'member',
    email: '',
    notes: ''
})

// 表单验证错误（只保留姓名和邮箱的验证）
const errors = reactive({
    name: '',
    email: ''
})

// 状态管理
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// 表单验证函数 - 只验证姓名和邮箱
function validateForm() {
    let isValid = true

    // 重置错误信息
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    // 验证姓名（必填）
    if (!memberForm.name.trim()) {
        errors.name = '请输入成员姓名'
        isValid = false
    }

    // 验证邮箱（必填）
    if (!memberForm.email.trim()) {
        errors.email = '请输入邮箱地址'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) {
        errors.email = '请输入有效的邮箱地址'
        isValid = false
    }

    return isValid
}

// 提交表单
async function submitForm() {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true
    errorMessage.value = ''

    try {
        const Challengeresult = await computeChallenge();
        if (!Challengeresult.success) {
            if (Challengeresult.error) {
                throw new Error(`安全验证失败：${Challengeresult.error}`)
            }
            throw new Error('安全验证失败：未知错误')
        }
        if (Challengeresult.response && Challengeresult.challenge) {
            console.log(`response: ${Challengeresult.response}`)
            console.debug(`challenge: ${Challengeresult.challenge}`)
        }
        // 调用API接口添加成员（移除student_no字段）
        const response = await fetch(`${apinodes[0]!.domain}/api/admin/member/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                response: Challengeresult.response,
                challenge: Challengeresult.challenge,
                name: memberForm.name,
                department: memberForm.department || null, // 部门改为可选
                role: memberForm.role || 'member',
                email: memberForm.email,
                notes: memberForm.notes || null
            })
        })

        const result = await response.json()

        // 根据返回的success字段判断操作是否成功
        if (result.success) {
            successMessage.value = '成员添加成功！'
            showToast("success", '成员添加成功')

            // 3秒后自动跳转到成员管理页面
            setTimeout(() => {
                emit('tabChange', 'member-management')
            }, 3000)
        } else {
            errorMessage.value = result.message || '添加成员失败，请稍后重试'
            showToast("error", errorMessage.value)
        }
    } catch (error) {
        console.error('添加成员失败:', error)
        errorMessage.value = '网络错误，请检查网络连接后重试'
        showToast("error", '网络错误，请稍后重试')
    } finally {
        isSubmitting.value = false
    }
}

// 重置表单（移除studentNo字段）
function resetForm() {
    Object.assign(memberForm, {
        name: '',
        department: '',
        role: 'member',
        email: '',
        notes: ''
    })

    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    successMessage.value = ''
    errorMessage.value = ''
}

// 返回上一页（成员管理页面）
function goBack() {
    emit('tabChange', 'member-management')
}
</script>

<style scoped>
.add-member-view {
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 2rem 0;
}

.page-title {
    font-weight: 600;
    color: #2c3e50;
}

.card {
    border-radius: 0.75rem;
}

.required::after {
    content: " *";
    color: #dc3545;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.btn {
    border-radius: 0.5rem;
    font-weight: 500;
}

.alert {
    border-radius: 0.5rem;
    border: none;
}
</style>