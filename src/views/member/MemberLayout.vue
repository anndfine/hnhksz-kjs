<!-- src/views/member/MemberLayout.vue -->
<template>
    <div class="member-app">
        <!-- 认证检查中 -->
        <div v-if="authLoading" class="auth-loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
            </div>
            <p class="mt-3">检查登录状态...</p>
        </div>

        <!-- 未登录状态：显示登录界面 -->
        <div v-else-if="!isAuthenticated" class="login-layout">
            <LoginView @login-success="handleLoginSuccess" />
        </div>

        <!-- 已登录状态：显示主界面 -->
        <div v-else class="main-layout">
            <!-- 顶部导航栏 -->
            <MemberNavbar :is-sidebar-collapsed="isSidebarCollapsed" :user="user" @toggle-sidebar="toggleSidebar"
                @tab-change="handleTabChange" @logout="handleLogout" />

            <!-- 侧边栏和内容区域容器 -->
            <div class="main-container">
                <!-- 侧边栏 -->
                <MemberSidebar :active-tab="activeTab" :is-collapsed="isSidebarCollapsed" @tab-change="handleTabChange"
                    :user="user" @toggle="toggleSidebar" />

                <!-- 主要内容区域 -->
                <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
                    <div class="content-wrapper">
                        <!-- 动态组件切换 -->
                        <component :user="user" :is="currentComponent" @tabChange="handleTabChange" />
                    </div>
                </div>
            </div>

            <!-- 全局模态框 -->
            <AddDeviceModal v-if="showAddDeviceModal" @close="showAddDeviceModal = false" @save="handleAddDevice" />
            <ExportDataModal v-if="showExportDataModal" @close="showExportDataModal = false"
                @export="handleExportData" />
            <DeleteAccountModal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false"
                @confirm="handleDeleteAccount" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 导入组件
import { useAuth } from '@/components/member/useAuth.ts'
import LoginView from '@/components/member/LoginView.vue'
import DashboardView from '@/components/member/DashboardView.vue'
import MemberNavbar from '@/components/member/MemberNavbar.vue'
import MemberSidebar from '@/components/member/MemberSidebar.vue'
import ProfileView from '@/components/member/ProfileView.vue'
import EditProfileView from '@/components/member/profile/ProfileEdit.vue'
import DevicesView from '@/components/member/DevicesView.vue'
import AttendanceView from '@/components/member/AttendanceView.vue'
import HelpView from '@/components/member/HelpView.vue'
import SettingsView from '@/components/member/SettingsView.vue'
import AddDeviceModal from '@/components/member/modals/AddDeviceModal.vue'
import ExportDataModal from '@/components/member/modals/ExportDataModal.vue'
import DeleteAccountModal from '@/components/member/modals/DeleteAccountModal.vue'
import ProfileEdit from '@/components/member/profile/ProfileEdit.vue'
import MemberManagement from '@/components/member/MemberManagementView.vue'

const { isAuthenticated, user, loading: authLoading, checkAuth, logout, startPolling } = useAuth()

// 当前激活的标签页
const activeTab = ref('dashboard')

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
    dashboard: '查看系统概览和快速操作',
    profile: '查看和编辑个人资料信息',
    devices: '管理和监控物联网设备',
    attendance: '记录和查看活动参与情况',
    help: '了解系统功能和使用方法',
    settings: '个性化设置和账户管理'
}

// 动态组件映射
const componentMap = {

    dashboard: DashboardView,  // 新增
    profile: ProfileView,
    devices: DevicesView,
    attendance: AttendanceView,
    help: HelpView,
    settings: SettingsView,
    editprofile: EditProfileView,
    'member-management': MemberManagement
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

const handleLoginSuccess = () => {
    // 登录成功后可以执行一些操作，比如跳转到默认页面
    activeTab.value = 'dashboard'
}

const handleLogout = async () => {
    await logout()
    // 登出后可以重置状态
    activeTab.value = 'dashboard'
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
onMounted(async () => {
    await checkAuth()
    checkScreenSize()

    // 如果已认证，开始轮询检查
    if (isAuthenticated.value) {
        const pollingInterval = startPolling()

        onUnmounted(() => {
            if (pollingInterval) {
                clearInterval(pollingInterval)
            }
        })
    }

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

.auth-loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.main-layout {
    min-height: 100vh;
}

.main-container {
    display: flex;
    min-height: calc(100vh - 60px);
}

.main-content {
    flex: 1;
    margin-left: 250px;
    background: white;
    min-height: 100%;
    transition: all 0.56s ease;
}

.main-content.sidebar-collapsed {
    transition: all 0.56s ease;
    margin-left: 64px;
}

.content-wrapper {
    padding: 24px;
    margin-top: 4px;
    min-height: 100%;
    transition: all 1.0s ease;
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
        transition: all 0.56s ease;
        /* 为平板设备也设置过渡效果 */
    }

    .content-wrapper {
        padding: 16px;
    }

    .page-title {
        font-size: 1.5rem;
    }
}

@media (max-width: 992px) {
    .main-content {
        margin-top: 64px !important;
        transition: margin-top 1.0s ease;
    }
}

@media (min-width: 992px) {
    .main-content {
        margin-top: 8px !important;
        transition: margin-top 1.0s ease, margin-left 0.56s ease;
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