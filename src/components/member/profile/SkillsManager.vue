<!-- src/components/member/profile/SkillsManager.vue -->
<template>
    <div class="card border-0 shadow-sm d-none">
        <div class="card-body p-4">
            <h5 class="card-title fw-bold mb-4">技能标签</h5>
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span v-for="skill in skills" :key="skill" class="badge bg-light text-dark">
                    {{ skill }}
                    <button type="button" class="btn-close btn-close-white ms-1"
                        @click="$emit('remove', skill)"></button>
                </span>
            </div>
            <div class="input-group">
                <input type="text" class="form-control" placeholder="添加新技能标签" v-model="newSkill"
                    @keyup.enter="addNewSkill">
                <button class="btn btn-outline-secondary" type="button" @click="addNewSkill">添加</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    skills: string[]
}>()

const emit = defineEmits<{
    add: [skill: string]
    remove: [skill: string]
}>()

const newSkill = ref('')

const addNewSkill = () => {
    if (newSkill.value.trim() && !props.skills.includes(newSkill.value.trim())) {
        emit('add', newSkill.value.trim())
        newSkill.value = ''
    }
}
</script>