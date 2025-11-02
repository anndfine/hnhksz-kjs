<!-- src/components/member/devices/DeviceList.vue -->
<template>
    <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title fw-bold mb-0">科技社的物联网设备</h5>
                <!-- <button class="btn btn-primary" @click="$emit('add')">
                    <i class="bi bi-plus-circle me-1"></i>
                    添加设备
                </button> -->
                <button class="btn btn-primary disabled" @click="$emit('add')">
                    <i class="bi bi-plus-circle me-1"></i>
                    联系指导老师或管理员添加设备
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>设备名称</th>
                            <th>设备类型</th>
                            <th>状态</th>
                            <th>最后在线</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="device in devices" :key="device.id">
                            <td>{{ device.name }}</td>
                            <td>{{ device.type }}</td>
                            <td>
                                <span :class="['badge', device.status === '在线' ? 'bg-success' : 'bg-danger']">
                                    {{ device.status }}
                                </span>
                            </td>
                            <td>{{ device.lastOnline }}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('view', device)">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary me-1" @click="$emit('edit', device)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', device.id)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Device {
    id: string
    name: string
    type: string
    status: '在线' | '离线'
    lastOnline: string
}

defineProps<{
    devices: Device[]
}>()

defineEmits<{
    add: []
    view: [device: Device]
    edit: [device: Device]
    delete: [deviceId: string]
}>()
</script>