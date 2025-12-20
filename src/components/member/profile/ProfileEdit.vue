<!-- src/components/member/profile/ProfileEdit.vue -->
<template>
    <div class="profile-edit-container">
        <!-- 页面标题 -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-secondary me-3" @click="$emit('back')">
                        <i class="bi bi-arrow-left"></i> 返回
                    </button>
                    <div>
                        <h4 class="text-primary mb-1">编辑个人资料</h4>
                        <p class="text-muted mb-0">完善个人信息，让其他成员更好地了解你</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 编辑内容区域 -->
        <div class="row">
            <!-- 左侧：头像和基本信息 -->
            <div class="col-lg-4 mb-4">
                <!-- 头像上传卡片 -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h6 class="card-title mb-0">
                            <i class="bi bi-person-circle me-2"></i>头像设置
                        </h6>
                    </div>
                    <div class="card-body text-center">
                        <!-- 头像预览 -->
                        <div class="avatar-preview mb-3">
                            <img :src="avatarPreview || props.profile?.avatar || defaultAvatar" alt="头像预览"
                                class="rounded-circle shadow" width="120" height="120">
                        </div>

                        <!-- 头像上传控件 -->
                        <div class="avatar-upload">
                            <input type="file" ref="avatarInput" accept="image/*" class="d-none"
                                @change="handleAvatarUpload">
                            <button class="btn btn-outline-primary btn-sm me-2" @click="avatarInput?.click()">
                                <i class="bi bi-upload me-1"></i>上传头像
                            </button>
                            <button v-if="avatarPreview" class="btn btn-outline-danger btn-sm" @click="resetAvatar">
                                <i class="bi bi-x-circle me-1"></i>重置
                            </button>
                        </div>

                        <div class="text-muted small mt-2">
                            支持 JPG、PNG 格式，大小不超过 2MB
                        </div>
                    </div>
                </div>

                <!-- 账户信息卡片 -->
                <div class="card shadow-sm">
                    <div class="card-header bg-light">
                        <h6 class="card-title mb-0">
                            <i class="bi bi-info-circle me-2"></i>账户信息
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span>用户ID</span>
                                <code class="text-primary">{{ props.user?.id || 'N/A' }}</code>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span>邮箱</span>
                                <small class="text-muted">{{ props.user?.email || 'N/A' }}</small>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span>注册时间</span>
                                <small class="text-muted">{{ formatDate(props.profile?.createTime) }}</small>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span>最后登录</span>
                                <small class="text-muted">{{ formatRelativeTime(props.profile?.lastLogin) }}</small>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span>账户状态</span>
                                <span class="badge bg-success">正常</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：详细信息编辑 -->
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-pencil-square me-2"></i>个人信息
                        </h5>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="handleSave">
                            <!-- 基本信息 -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary border-bottom pb-2 mb-3">基本信息</h6>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="name" class="form-label required">姓名</label>
                                    <input type="text" class="form-control" id="name" v-model="editProfile.name"
                                        :class="{ 'is-invalid': errors.name }" placeholder="请输入真实姓名">
                                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="studentId" class="form-label required">学号</label>
                                    <input type="text" class="form-control" id="studentId" v-model="editProfile.id"
                                        :class="{ 'is-invalid': errors.studentId }" placeholder="请输入学号">
                                    <div v-if="errors.id" class="invalid-feedback">{{ errors.studentId }}</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="grade" class="form-label required">年级</label>
                                    <select class="form-select" id="grade" v-model="editProfile.grade"
                                        :class="{ 'is-invalid': errors.grade }">
                                        <option value="">请选择年级</option>
                                        <option value="高一">高一</option>
                                        <option value="高二">高二</option>
                                        <option value="高三">高三</option>
                                    </select>
                                    <div v-if="errors.grade" class="invalid-feedback">{{ errors.grade }}</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="department" class="form-label required">所属部门</label>
                                    <select class="form-select" id="department" v-model="editProfile.department"
                                        :class="{ 'is-invalid': errors.department }">
                                        <option value="">请选择部门</option>
                                        <option value="科创组">科创组</option>
                                        <option value="航模组">航模组</option>
                                        <option value="摄影组">摄影组</option>
                                        <option value="校草组">校草（植物）组</option>
                                        <option value="机器人组">机器人组</option>
                                        <option value="电子技术组">电子技术组</option>
                                        <option value="物联网部">物联网部</option>
                                        <option value="软件部">软件部</option>
                                    </select>
                                    <div v-if="errors.department" class="invalid-feedback">{{ errors.department }}</div>
                                </div>
                            </div>

                            <!-- 个人简介 -->
                            <div class="mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary border-bottom pb-2 mb-3">个人介绍</h6>
                                </div>

                                <div class="mb-3">
                                    <label for="bio" class="form-label">个人简介</label>
                                    <textarea class="form-control" id="bio" rows="4" v-model="editProfile.bio"
                                        placeholder="介绍一下自己，让其他成员更好地了解您..."></textarea>
                                    <div class="form-text">这段介绍会在您的个人主页展示</div>
                                </div>

                                <div class="mb-3">
                                    <label for="interests" class="form-label">兴趣爱好</label>
                                    <textarea class="form-control" id="interests" rows="2"
                                        v-model="editProfile.interests" placeholder="请输入您的兴趣爱好..."></textarea>
                                </div>
                            </div>

                            <!-- 技能标签 -->
                            <div class="mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary border-bottom pb-2 mb-3">技能标签</h6>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">专业技能</label>
                                    <div class="skills-input mb-2">
                                        <div class="input-group">
                                            <input type="text" class="form-control" v-model="newSkill"
                                                placeholder="输入技能名称" @keypress.enter="addSkill">
                                            <button class="btn btn-outline-primary" type="button" @click="addSkill">
                                                <i class="bi bi-plus"></i> 添加
                                            </button>
                                        </div>
                                    </div>

                                    <div class="skills-tags">
                                        <span v-for="(skill, index) in editProfile.skills" :key="index"
                                            class="badge bg-primary me-1 mb-1 skill-tag">
                                            {{ skill }}
                                            <button type="button" class="btn-close btn-close-white ms-1"
                                                @click="removeSkill(index)"></button>
                                        </span>
                                        <span v-if="!editProfile.skills || editProfile.skills.length === 0"
                                            class="text-muted small">
                                            暂无技能标签，点击上方添加
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                                <button type="button" class="btn btn-outline-secondary" @click="handleCancel">
                                    取消
                                </button>
                                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                    <i class="bi bi-check-lg me-1"></i>
                                    {{ isSubmitting ? '保存中...' : '保存更改' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { apinodes } from '@/data/apinodes'

interface Profile {
    id?: number
    name?: string
    avatar?: string
    role?: string
    department?: string
    status?: string
    email?: string
    grade?: string
    bio?: string
    interests?: string
    skills?: string[]
    createTime?: string
    lastLogin?: string
}


// Props 和 Emits
const props = defineProps<{
    profile: Profile
    user: Profile | null
}>()

const emit = defineEmits<{
    save: [profile: Profile]
    back: []
}>()

// 模板refs - 使用字符串ref
const avatarInput = ref<HTMLInputElement | null>(null)


// 默认头像
const defaultAvatar = props.user?.avatar || 'https://cn1.anndfine.top/downloadfiles/kjcxs:avatar:avatar_default'

// 响应式数据
const editProfile = reactive<Profile>({ ...props.profile })
const avatarPreview = ref<string>('')
const newSkill = ref<string>('')
const isSubmitting = ref<boolean>(false)
const errors = reactive<Record<string, string>>({})

// 表单验证
const validateForm = (): boolean => {
    // 清空错误信息
    Object.keys(errors).forEach(key => delete errors[key])

    let isValid = true
    const currentName = editProfile.name || ''
    const currentId = editProfile.id || ''
    const currentEmail = editProfile.email || ''

    if (!currentName.trim()) {
        errors.name = '请输入姓名'
        isValid = false
    }

    if (!currentId.toString().trim()) {
        errors.id = '请输入学号'
        isValid = false
    }

    if (!editProfile.grade) {
        errors.grade = '请选择年级'
        isValid = false
    }

    if (!editProfile.department) {
        errors.department = '请选择所属部门'
        isValid = false
    }

    if (!currentEmail.trim()) {
        errors.email = '请输入邮箱地址'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
        errors.email = '请输入有效的邮箱地址'
        isValid = false
    }

    return isValid
}

// 头像上传处理
const handleAvatarUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // 文件类型验证
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
    }

    // 文件大小验证（2MB）
    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB')
        return
    }

    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
        avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

// 重置头像
const resetAvatar = () => {
    avatarPreview.value = ''
    const avatarInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (avatarInput) avatarInput.value = ''
}

// 技能管理 - 添加类型检查
const addSkill = () => {
    const skill = newSkill.value.trim()
    if (skill && editProfile.skills && !editProfile.skills.includes(skill)) {
        editProfile.skills.push(skill)
        newSkill.value = ''
    }
}

const removeSkill = (index: number) => {
    if (editProfile.skills) {
        editProfile.skills.splice(index, 1)
    }
}

// 保存处理
const handleSave = async () => {
    if (!validateForm()) return

    isSubmitting.value = true
    try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 如果有新头像，处理头像上传
        if (avatarPreview.value) {
            console.log('上传新头像:', avatarPreview.value)
            // 实际项目中这里应该调用头像上传API
        }

        // 触发保存事件
        emit('save', { ...editProfile, avatar: avatarPreview.value || editProfile.avatar })

        // 显示成功消息
        console.log('个人信息保存成功')
    } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请稍后重试')
    } finally {
        isSubmitting.value = false
    }
}

// 取消编辑
const handleCancel = () => {
    if (JSON.stringify(editProfile) !== JSON.stringify(props.profile) || avatarPreview.value) {
        if (confirm('您有未保存的更改，确定要取消吗？')) {
            emit('back')
        }
    } else {
        emit('back')
    }
}

// 工具函数
const formatDate = (dateString?: string) => {
    if (!dateString) return '未知'
    return new Date(dateString).toLocaleDateString('zh-CN')
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

// 监听props变化，更新编辑数据
watch(() => props.profile, (newProfile) => {
    Object.assign(editProfile, newProfile)
}, { deep: true })
</script>

<style scoped>
.profile-edit-container {
    min-height: 100%;
}

.required::after {
    content: " *";
    color: #dc3545;
}

.avatar-preview img {
    object-fit: cover;
    border: 3px solid #e9ecef;
    transition: border-color 0.3s ease;
}

.avatar-preview img:hover {
    border-color: #0d6efd;
}

.skill-tag {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
}

.skills-tags {
    min-height: 2.5rem;
}

.form-text {
    font-size: 0.875rem;
}

.card {
    border-radius: 0.75rem;
}

.card-header {
    border-radius: 0.75rem 0.75rem 0 0 !important;
}
</style>