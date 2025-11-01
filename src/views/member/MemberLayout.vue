<!-- src/views/member/MemberLayout.vue -->
<template>
    <div class="member-app">
        <!-- 顶部导航栏（简化版） -->
        <MemberNavbar :is-sidebar-collapsed="isSidebarCollapsed" @toggle-sidebar="toggleSidebar" />

        <!-- 侧边栏和内容区域容器 -->
        <div class="main-container">
            <!-- 侧边栏（主要导航） -->
            <MemberSidebar :active-tab="activeTab" :is-collapsed="isSidebarCollapsed" @tab-change="handleTabChange"
                @toggle="toggleSidebar" />

            <!-- 主要内容区域 -->
            <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
                <div class="content-wrapper">
                    <!-- 页面标题栏 -->
                    <div class="page-header mb-4">
                        <!-- <h1 class="page-title">{{ pageTitles[activeTab] }}</h1> -->
                        <!-- <p class="page-subtitle text-muted d-none">{{ pageSubtitles[activeTab] }}</p> -->
                    </div>

                    <!-- 动态组件切换 -->
                    <component :is="currentComponent" />
                </div>
            </div>
        </div>

        <!-- 全局模态框 -->
        <AddDeviceModal v-if="showAddDeviceModal" @close="showAddDeviceModal = false" @save="handleAddDevice" />
        <ExportDataModal v-if="showExportDataModal" @close="showExportDataModal = false" @export="handleExportData" />
        <DeleteAccountModal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false"
            @confirm="handleDeleteAccount" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 导入组件
import DashboardView from '@/components/member/DashboardView.vue'
import MemberNavbar from '@/components/member/MemberNavbar.vue'
import MemberSidebar from '@/components/member/MemberSidebar.vue'
import ProfileView from '@/components/member/ProfileView.vue'
import DevicesView from '@/components/member/DevicesView.vue'
import AttendanceView from '@/components/member/AttendanceView.vue'
import HelpView from '@/components/member/HelpView.vue'
import SettingsView from '@/components/member/SettingsView.vue'
import AddDeviceModal from '@/components/member/modals/AddDeviceModal.vue'
import ExportDataModal from '@/components/member/modals/ExportDataModal.vue'
import DeleteAccountModal from '@/components/member/modals/DeleteAccountModal.vue'

// 当前激活的标签页
const activeTab = ref('profile')

// 侧边栏状态
const isSidebarCollapsed = ref(false)

// 模态框状态
const showAddDeviceModal = ref(false)
const showExportDataModal = ref(false)
const showDeleteAccountModal = ref(false)

// 页面标题映射
const pageTitles = {
    dashboard: '工作台',
    profile: '个人信息',
    devices: '设备管理',
    attendance: '打卡记录',
    help: '使用帮助',
    settings: '系统设置'
}

const pageSubtitles = {
    profile: '查看和编辑您的个人资料信息',
    devices: '管理和监控您的物联网设备',
    attendance: '查看您的活动打卡记录',
    help: '了解如何使用成员系统的各项功能',
    settings: '管理您的账户和系统设置'
}

// 动态组件映射
const componentMap = {

    dashboard: DashboardView,  // 新增
    profile: ProfileView,
    devices: DevicesView,
    attendance: AttendanceView,
    help: HelpView,
    settings: SettingsView
}

const currentComponent = computed(() => {
    return componentMap[activeTab.value as keyof typeof componentMap]
})

// 响应式断点处理
const checkScreenSize = () => {
    const width = window.innerWidth
    if (width < 768) {
        isSidebarCollapsed.value = true
    } else {
        isSidebarCollapsed.value = false
    }
}

// 事件处理
const handleTabChange = (tab: string) => {
    activeTab.value = tab
    // 移动端切换标签时自动收起侧边栏
    if (window.innerWidth < 768) {
        isSidebarCollapsed.value = true
    }
}

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleAddDevice = (deviceData: any) => {
    console.log('添加设备:', deviceData)
    showAddDeviceModal.value = false
}

const handleExportData = (options: any) => {
    console.log('导出数据:', options)
    showExportDataModal.value = false
}

const handleDeleteAccount = (password: string) => {
    console.log('删除账户，密码:', password)
    showDeleteAccountModal.value = false
}

// 生命周期
onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.member-app {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.main-container {
    display: flex;
    min-height: calc(100vh - 60px);
}

.main-content {
    flex: 1;
    margin-left: 250px;
    transition: margin-left 0.3s ease;
    background: white;
    min-height: 100%;
}

.main-content.sidebar-collapsed {
    margin-left: 64px;
}

.content-wrapper {
    padding: 24px;
    min-height: 100%;
}

.page-header {
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 16px;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1e3c72;
}

.page-subtitle {
    font-size: 1rem;
    margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 767.98px) {
    .main-content {
        margin-left: 0 !important;
    }

    .content-wrapper {
        padding: 16px;
    }

    .page-title {
        font-size: 1.5rem;
    }
}

@media (min-width: 768px) and (max-width: 1199.98px) {
    .main-content {
        margin-left: 200px;
    }

    .main-content.sidebar-collapsed {
        margin-left: 64px;
    }
}
</style>