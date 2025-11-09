<!-- src/components/member/profile/ProfileForm.vue -->
<template>
    <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
            <h5 class="card-title fw-bold mb-4">基本信息</h5>
            <form @submit.prevent="$emit('save')">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="name" class="form-label">姓名</label>
                        <input type="text" class="form-control" id="name" v-model="profile.name">
                    </div>
                    <div class="col-md-6">
                        <label for="studentId" class="form-label">学号</label>
                        <input type="text" class="form-control" id="studentId" v-model="profile.studentId" readonly>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="email" class="form-label">邮箱</label>
                        <input type="email" class="form-control" id="email" v-model="profile.email">
                    </div>
                    <div class="col-md-6 d-none">
                        <label for="phone" class="form-label">电话</label>
                        <input type="tel" class="form-control" id="phone" v-model="profile.phone">
                    </div>

                    <div class="col-md-6 d-none">
                        <label for="joinDate" class="form-label">加入时间</label>
                        <input type="date" class="form-control" id="joinDate" v-model="profile.joinDate" readonly>
                    </div>
                    <div class="col-md-6">
                        <label for="grade" class="form-label">年级</label>
                        <select class="form-select" id="grade" v-model="profile.grade">
                            <option value="高一">高一</option>
                            <option value="高二">高二</option>
                            <option value="高三">高三</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-3">
                </div>
                <div class="mb-3">
                    <label for="bio" class="form-label">个人简介<small class="text-muted">（可选，会在主页展示）</small></label>
                    <textarea class="form-control disabled" id="bio" rows="3" v-model="profile.bio"></textarea>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary disabled" :disabled="!profile.bio">保存信息</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    profile: {
        name: string
        studentId: string
        email: string
        phone: string
        joinDate: string
        grade: string
        bio: string
    }
}>()

defineEmits<{
    save: []
}>()
</script>