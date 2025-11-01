<!-- src/components/member/modals/DeleteAccountModal.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">删除账户</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger">
                        <strong>警告：</strong> 此操作不可逆，删除账户后您将无法恢复任何数据。
                    </div>
                    <p>如果您确定要删除账户，请输入您的密码以确认：</p>
                    <div class="mb-3">
                        <label for="deletePassword" class="form-label">密码</label>
                        <input type="password" class="form-control" id="deletePassword" v-model="password">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
                    <button type="button" class="btn btn-danger" @click="handleDelete">删除账户</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    close: []
    confirm: [password: string]
}>()

const password = ref('')

const handleDelete = () => {
    if (password.value) {
        emit('confirm', password.value)
        password.value = ''
    }
}
</script>