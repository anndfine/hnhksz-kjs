<!-- src/components/member/DevicesView.vue -->
<template>
    <div class="tab-content">
        <div class="row mb-4">
            <div class="col-12">
                <DeviceList :devices="devices" @add="showAddModal" @view="viewDevice" @edit="editDevice"
                    @delete="deleteDevice" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-4">
                <DeviceStats :stats="deviceStats" />
            </div>

            <div class="col-md-6 mb-4">
                <DeviceTypeDistribution :distribution="deviceTypeDistribution" :total="deviceStats.total" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeviceList from '@/components/member/devices/DeviceList.vue'
import DeviceStats from '@/components/member/devices/DeviceStats.vue'
import DeviceTypeDistribution from '@/components/member/devices/DeviceTypeDistribution.vue'

interface Device {
    id: string
    name: string
    type: string
    status: '在线' | '离线'
    lastOnline: string
}

const devices = ref<Device[]>([
    { id: 'DEV001', name: '温湿度传感器', type: '传感器', status: '在线', lastOnline: '2023-11-15 14:30' },
    { id: 'DEV002', name: '智能LED灯', type: '执行器', status: '离线', lastOnline: '2023-11-14 18:45' },
    { id: 'DEV003', name: 'Arduino控制器', type: '控制器', status: '在线', lastOnline: '2023-11-15 15:20' },
    { id: 'DEV004', name: 'OLED显示屏', type: '显示器', status: '在线', lastOnline: '2023-11-15 12:10' }
])

const deviceStats = computed(() => {
    const total = devices.value.length
    const online = devices.value.filter(d => d.status === '在线').length
    const offline = total - online

    return { total, online, offline }
})

const deviceTypeDistribution = computed(() => {
    const distribution: Record<string, number> = {}
    devices.value.forEach(device => {
        distribution[device.type] = (distribution[device.type] || 0) + 1
    })
    return distribution
})

const showAddModal = () => {
    // 通过事件总线或provide/inject触发模态框显示
    const event = new CustomEvent('show-add-device-modal')
    window.dispatchEvent(event)
}

const viewDevice = (device: Device) => {
    console.log('查看设备详情', device)
}

const editDevice = (device: Device) => {
    console.log('编辑设备', device)
}

const deleteDevice = (deviceId: string) => {
    const index = devices.value.findIndex(d => d.id === deviceId)
    if (index !== -1) {
        devices.value.splice(index, 1)
    }
}
</script>