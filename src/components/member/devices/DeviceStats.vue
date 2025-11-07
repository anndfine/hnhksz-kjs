<!-- src/components/member/devices/DeviceStats.vue -->
<template>
    <div class="card border-0 shadow-sm h-100 d-none">
        <div class="card-body p-4">
            <h5 class="card-title fw-bold mb-4">设备统计</h5>
            <div class="row text-center">
                <div class="col-4">
                    <div class="stat-item">
                        <h3 class="text-primary">{{ stats.total }}</h3>
                        <p class="text-muted mb-0">总设备数</p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-item">
                        <h3 class="text-success">{{ stats.online }}</h3>
                        <p class="text-muted mb-0">在线设备</p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-item">
                        <h3 class="text-danger">{{ stats.offline }}</h3>
                        <p class="text-muted mb-0">离线设备</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    stats: {
        total: number
        online: number
        offline: number
    }
}>()
</script>

<style scoped>
.stat-item {
    padding: 10px;
}
</style>