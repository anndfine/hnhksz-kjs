<!-- src/components/member/profile/ProfileCard.vue -->
<template>
    <div class="card border-0 shadow-sm h-100">
        <div class="card-body text-center p-4">
            <div class="avatar-container mb-3">
                <img :src="user?.avatar || 'https://cn1.anndfine.top/downloadfiles/kjcxs:avatar:avatar_default'"
                    alt="头像" class="rounded-circle avatar-img">
                <button class="btn btn-sm btn-primary avatar-edit-btn">
                    <i class="bi bi-camera"></i>
                </button>
            </div>
            <h4 class="fw-bold">{{ user?.name || '用户' }}</h4>
            <p class="text-muted">{{ user?.role || '角色' }}</p>
            <div class="d-flex justify-content-center gap-2">
                <span class="badge bg-primary">{{ user?.department || '部门' }}</span>
                <span class="badge bg-success">{{ user?.status || '状态' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface user {
    id?: number
    name?: string
    avatar?: string
    role?: string
    department?: string
    status?: string
}
defineProps<{
    profile: {
        name: string
        role: string
        department: string
        status: string
    }
    user: user | null
}>()
</script>

<style scoped>
.avatar-container {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>