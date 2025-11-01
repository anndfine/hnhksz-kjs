<!-- src/components/member/profile/ProfileCard.vue -->
<template>
    <div class="card border-0 shadow-sm h-100">
        <div class="card-body text-center p-4">
            <div class="avatar-container mb-3">
                <img src="https://cn1.anndfine.top/downloadfiles/fduXdSy_KD0" alt="头像"
                    class="rounded-circle avatar-img">
                <button class="btn btn-sm btn-primary avatar-edit-btn">
                    <i class="bi bi-camera"></i>
                </button>
            </div>
            <h4 class="fw-bold">{{ profile.name }}</h4>
            <p class="text-muted">{{ profile.role }}</p>
            <div class="d-flex justify-content-center gap-2">
                <span class="badge bg-primary">{{ profile.department }}</span>
                <span class="badge bg-success">{{ profile.status }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    profile: {
        name: string
        role: string
        department: string
        status: string
    }
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