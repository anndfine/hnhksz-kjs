<!-- src/components/member/modals/ExportDataModal.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">导出数据</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <p>选择您要导出的数据类型：</p>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="exportProfile" v-model="options.profile">
                        <label class="form-check-label" for="exportProfile">个人信息</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="exportDevices" v-model="options.devices">
                        <label class="form-check-label" for="exportDevices">设备信息</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="exportAttendance"
                            v-model="options.attendance">
                        <label class="form-check-label" for="exportAttendance">打卡记录</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="exportSettings" v-model="options.settings">
                        <label class="form-check-label" for="exportSettings">系统设置</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
                    <button type="button" class="btn btn-primary" @click="handleExport">导出数据</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    close: []
    export: [options: any]
}>()

const options = ref({
    profile: true,
    devices: true,
    attendance: true,
    settings: false
})

const handleExport = () => {
    emit('export', { ...options.value })
}
</script>