<!-- src/components/member/devices/DeviceList.vue -->
<template>
    <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title fw-bold mb-0">科技社的物联网设备</h5>
                <div class="d-flex align-items-center">
                    <span class="text-muted me-3">共 {{ totalDevices }} 台设备</span>
                    <button class="btn btn-outline-secondary btn-sm" @click="refreshDevices" :disabled="loading">
                        <i class="bi" :class="loading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'"></i>
                        {{ loading ? '刷新中...' : '刷新' }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-2 text-muted">正在获取设备信息...</p>
            </div>

            <div v-else-if="error" class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
                <button class="btn btn-sm btn-outline-warning ms-2" @click="refreshDevices">重试</button>
            </div>

            <div v-else-if="devices.length === 0" class="text-center py-5">
                <i class="bi bi-plug display-4 text-muted"></i>
                <p class="mt-3 text-muted">暂无在线设备</p>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>设备ID</th>
                            <th>设备名称</th>
                            <th>设备类型</th>
                            <th>版本</th>
                            <th>状态</th>
                            <th>IP地址</th>
                            <th>功能</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="device in devices" :key="device.deviceId">
                            <td>
                                <code class="text-primary">{{ device.deviceId }}</code>
                            </td>
                            <td>{{ device.name || '未命名' }}</td>
                            <td>
                                <span class="badge bg-info">{{ formatDeviceType(device.deviceType) }}</span>
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{ device.version }}</span>
                            </td>
                            <td>
                                <span :class="['badge', device.isOnline ? 'bg-success' : 'bg-danger']">
                                    <i class="bi" :class="device.isOnline ? 'bi-wifi' : 'bi-wifi-off'"></i>
                                    {{ formatStatusWithTime(device.isOnline, device.lastSeen) }}
                                </span>
                            </td>
                            <td>
                                <code class="text-muted small">{{ device.ip }}</code>
                            </td>
                            <td>
                                <div class="d-flex flex-wrap gap-1" style="max-width: 200px;">
                                    <span v-for="capability in device.capabilities" :key="capability"
                                        class="badge bg-light text-dark border small">
                                        {{ formatCapability(capability) }}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('view', device)">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary me-1" @click="$emit('edit', device)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', device.deviceId)">
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
import { ref, onMounted } from 'vue'
import { apinodes } from '@/data/apinodes'

interface DeviceCapability {
    deviceId: string
    deviceType: string
    version: string
    status: string
    capabilities: string[]
    lastSeen: number
    ip: string
    isOnline: boolean
    name?: string
}

interface DeviceListResponse {
    success: boolean
    data: {
        devices: DeviceCapability[]
        total: number
        timestamp: number
    }
}

const devices = ref<DeviceCapability[]>([])
const totalDevices = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

// 获取设备列表
const fetchDevices = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(`${apinodes[0]!.domain}/api/device/online-list`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`获取设备列表失败: ${response.status} ${response.statusText}`)
        }

        const result: DeviceListResponse = await response.json()

        if (result.success && result.data) {
            devices.value = result.data.devices
            totalDevices.value = result.data.total
        } else {
            throw new Error('获取设备信息失败')
        }
    } catch (err) {
        console.error('获取设备列表错误:', err)
        error.value = err instanceof Error ? err.message : '未知错误'
    } finally {
        loading.value = false
    }
}

// 刷新设备列表
const refreshDevices = () => {
    fetchDevices()
}

// 格式化设备类型
const formatDeviceType = (type: string): string => {
    const typeMap: Record<string, string> = {
        'sensor': '传感器',
        'actuator': '执行器',
        'controller': '控制器',
        'gateway': '网关'
    }
    return typeMap[type] || type
}

// 格式化功能名称
const formatCapability = (capability: string): string => {
    const capabilityMap: Record<string, string> = {
        'toggle': '开关控制',
        'read_sensor': '读取传感器',
        'report_data': '数据上报',
        'control': '设备控制',
        'monitor': '状态监控'
    }
    return capabilityMap[capability] || capability
}

// 格式化最后在线时间（简版）
const formatLastSeenSimple = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) { // 1分钟内
        return '刚刚'
    } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`
    } else {
        return `${Math.floor(diff / 86400000)}天前`
    }
}

// 格式化状态和时间组合
const formatStatusWithTime = (isOnline: boolean, lastSeen: number): string => {
    const timeText = formatLastSeenSimple(lastSeen)
    return isOnline ? `${timeText}` : `${timeText}`
}

// 组件挂载时自动获取设备列表
onMounted(() => {
    fetchDevices()
})

defineEmits<{
    view: [device: DeviceCapability]
    edit: [device: DeviceCapability]
    delete: [deviceId: string]
}>()
</script>

<style scoped>
.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.badge {
    font-size: 0.75em;
    white-space: nowrap;
}

.table th {
    font-weight: 600;
    font-size: 0.875rem;
    border-bottom: 2px solid #dee2e6;
}

.table td {
    vertical-align: middle;
    font-size: 0.875rem;
}
</style>