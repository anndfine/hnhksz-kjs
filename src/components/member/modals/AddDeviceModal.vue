<!-- src/components/member/modals/AddDeviceModal.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">添加新设备</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="deviceName" class="form-label">设备名称</label>
                            <input type="text" class="form-control" id="deviceName" v-model="form.name" required>
                        </div>
                        <div class="mb-3">
                            <label for="deviceType" class="form-label">设备类型</label>
                            <select class="form-select" id="deviceType" v-model="form.type" required>
                                <option value="">请选择设备类型</option>
                                <option value="传感器">传感器</option>
                                <option value="执行器">执行器</option>
                                <option value="控制器">控制器</option>
                                <option value="显示器">显示器</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="deviceId" class="form-label">设备ID</label>
                            <input type="text" class="form-control" id="deviceId" v-model="form.id" required>
                        </div>
                        <div class="mb-3">
                            <label for="deviceDescription" class="form-label">设备描述</label>
                            <textarea class="form-control" id="deviceDescription" rows="3"
                                v-model="form.description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
                    <button type="button" class="btn btn-primary" @click="handleSubmit">添加设备</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DeviceForm {
    name: string
    type: string
    id: string
    description: string
}

const emit = defineEmits<{
    close: []
    save: [device: DeviceForm]
}>()

const form = ref<DeviceForm>({
    name: '',
    type: '',
    id: '',
    description: ''
})

const handleSubmit = () => {
    if (form.value.name && form.value.type && form.value.id) {
        emit('save', { ...form.value })
        // 重置表单
        form.value = { name: '', type: '', id: '', description: '' }
    }
}
</script>