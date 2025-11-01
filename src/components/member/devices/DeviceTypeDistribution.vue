<!-- src/components/member/devices/DeviceTypeDistribution.vue -->
<template>
    <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
            <h5 class="card-title fw-bold mb-4">设备类型分布</h5>
            <div class="device-types">
                <div v-for="(count, type) in distribution" :key="type" class="device-type-item mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>{{ type }}</span>
                        <span class="badge bg-primary">{{ count }}</span>
                    </div>
                    <div class="progress mt-1" style="height: 5px;">
                        <div class="progress-bar bg-primary" :style="{ width: (count / total * 100) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    distribution: Record<string, number>
    total: number
}>()
</script>