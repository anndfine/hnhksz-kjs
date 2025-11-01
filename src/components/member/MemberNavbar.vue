<!-- src/components/member/MemberNavbar.vue -->
<template>
    <nav class="member-navbar navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div class="container-fluid">
            <!-- 移动端菜单按钮和品牌 -->
            <div class="d-flex align-items-center">
                <button class="navbar-toggler me-3" type="button" @click="$emit('toggleSidebar')">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <a class="navbar-brand fw-bold" href="#">
                    <i class="bi bi-person-circle me-2"></i>
                    <span class="d-none d-sm-inline">成员系统</span>
                </a>
            </div>

            <!-- 桌面端页面标题 -->
            <div class="navbar-nav d-none d-lg-flex mx-auto">
                <span class="nav-text text-white fw-semibold">
                    {{ currentPageTitle }}
                </span>
            </div>

            <!-- 用户菜单 -->
            <div class="navbar-nav ms-auto">
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
                        data-bs-toggle="dropdown">
                        <img src="https://cn1.anndfine.top/downloadfiles/fduXdSy_KD0" alt="用户头像"
                            class="rounded-circle me-2" style="width: 32px; height: 32px;">
                        <span class="d-none d-md-inline">张三</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="switchToProfile">
                                <i class="bi bi-person me-2"></i>个人资料
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="switchToSettings">
                                <i class="bi bi-gear me-2"></i>系统设置
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <a class="dropdown-item text-danger" href="#">
                                <i class="bi bi-box-arrow-right me-2"></i>退出登录
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    isSidebarCollapsed?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    toggleSidebar: []
    tabChange: [tab: string]
}>()

// 页面标题映射
const pageTitles = {
    profile: '个人信息',
    devices: '设备管理',
    attendance: '打卡记录',
    help: '使用帮助',
    settings: '系统设置'
}

// 这里可以通过Vuex/Pinia获取当前页面，或者通过props传递
const currentPage = 'profile' // 示例值
const currentPageTitle = computed(() => pageTitles[currentPage as keyof typeof pageTitles])

const switchToProfile = () => {
    emit('tabChange', 'profile')
}

const switchToSettings = () => {
    emit('tabChange', 'settings')
}
</script>

<style scoped>
.member-navbar {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    height: 60px;
    z-index: 1030;
}

.navbar-brand {
    font-size: 1.25rem;
}

.navbar-toggler {
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.25rem 0.5rem;
}

.navbar-toggler:hover {
    background: rgba(255, 255, 255, 0.1);
}

.nav-text {
    font-size: 1.1rem;
    font-weight: 500;
}

.nav-link.dropdown-toggle {
    color: rgba(255, 255, 255, 0.9);
    transition: color 0.3s ease;
}

.nav-link.dropdown-toggle:hover {
    color: white;
}

.dropdown-menu {
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
}

.dropdown-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

/* 响应式调整 */
@media (max-width: 767.98px) {
    .navbar-brand span {
        display: inline !important;
    }

    .nav-text {
        display: none;
    }
}
</style>