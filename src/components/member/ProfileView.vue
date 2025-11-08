<!-- src/components/member/ProfileView.vue -->
<template>
    <div class="tab-content">


        <div class="row">
            <div class="col-lg-4 mb-4">
                <ProfileCard :user="user" :profile="profile" />
            </div>

            <div class="col-lg-8 mb-4">
                <ProfileForm :profile="profile" @save="saveProfile" />
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <SkillsManager :skills="profile.skills" @add="addSkill" @remove="removeSkill" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ProfileCard from '@/components/member/profile/ProfileCard.vue'
import ProfileForm from '@/components/member/profile/ProfileForm.vue'
import SkillsManager from '@/components/member/profile/SkillsManager.vue'

interface Profile {
    name: string
    role: string
    department: string
    status: string
    studentId: string
    email: string
    phone: string
    joinDate: string
    grade: string
    bio: string
    skills: string[]
}


interface user {
    id: number
    name?: string
    avatar?: string
    role?: string
    department?: string
    lastLogin?: string
    permissions?: string[]
}


const profile = ref<Profile>({
    name: '张三',
    role: '社团成员',
    department: '物联网部',
    status: '活跃',
    studentId: '20230001',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    joinDate: '2023-09-01',
    grade: '高二',
    bio: '我对物联网和人工智能技术充满热情，希望能在科技社学习更多知识。',
    skills: ['Python', 'Arduino', 'HTML/CSS', 'JavaScript']
})

// 定义props
const props = defineProps<{
    user: user | null
}>()


// 监听user变化，更新profile数据
watch(() => props.user, (newUser) => {
    if (newUser) {
        profile.value.name = newUser.name || profile.value.name
        profile.value.role = newUser.role || profile.value.role
        profile.value.department = newUser.department || profile.value.department
    }
}, { immediate: true })

const saveProfile = () => {
    console.log('保存个人信息', profile.value)
    // API调用逻辑
}

const addSkill = (skill: string) => {
    if (skill.trim() && !profile.value.skills.includes(skill.trim())) {
        profile.value.skills.push(skill.trim())
    }
}

const removeSkill = (skill: string) => {
    const index = profile.value.skills.indexOf(skill)
    if (index !== -1) {
        profile.value.skills.splice(index, 1)
    }
}
</script>