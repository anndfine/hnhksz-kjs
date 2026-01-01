<!-- src/components/member/MemberSidebar.vue -->
<template>
    <aside class="member-sidebar" :class="{ 'collapsed': isCollapsed }">
        <!-- 侧边栏头部 -->
        <div class="sidebar-header d-lg-flex d-none">
            <div class="brand" v-if="!isCollapsed">
                <i class="bi bi-person-circle me-2"></i>
                <span class="brand-text">成员系统</span>
            </div>
            <div class="brand-icon" v-else>
                <i class="bi bi-person-circle"></i>
            </div>
            <button class="sidebar-toggle btn btn-sm" @click="$emit('toggle')">
                <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
            </button>
        </div>

        <!-- 侧边栏底部 -->
        <div class="sidebar-footer-container">
            <a href="#" class="sidebar-footer d-lg-flex d-none nav-link" v-if="!isCollapsed"
                @click.prevent="$emit('tabChange', 'profile')">
                <div class="user-info">
                    <div class="user-avatar">
                        <img :src="user?.avatar || 'https://cn1.anndfine.top/downloadfiles/kjcxs:avatar:avatar_default'"
                            alt="用户头像">
                    </div>
                    <div class="user-details">
                        <div class="user-name">{{ user?.name || '加载中...' }}</div>
                        <div class="user-role">{{ user?.isAdmin ? '管理员' : (user?.role || '社团成员') }}</div>
                    </div>
                </div>
            </a>
        </div>

        <!-- 导航菜单 -->
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <!-- 基础菜单项 -->
                <li v-for="tab in tabs" :key="tab.id" class="nav-item">
                    <a href="#" class="nav-link" :class="{ 'active': activeTab === tab.id }"
                        @click.prevent="$emit('tabChange', tab.id)">
                        <i :class="[tab.icon, 'nav-icon']"></i>
                        <span class="nav-text" v-if="!isCollapsed">{{ tab.name }}</span>
                        <span class="tooltip" v-if="isCollapsed">{{ tab.name }}</span>
                    </a>
                </li>

                <!-- 管理员工具下拉菜单 -->
                <li v-if="user?.isAdmin" class="nav-item admin-section">
                    <!-- 管理员工具标题 -->
                    <div class="admin-header" @click="toggleAdminMenu">
                        <div class="admin-title">
                            <i class="bi bi-tools nav-icon"></i>
                            <span class="nav-text" v-if="!isCollapsed">管理员工具</span>
                            <span class="tooltip" v-if="isCollapsed">管理员工具</span>
                        </div>
                        <i class="bi admin-chevron" :class="isAdminMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
                            v-if="!isCollapsed"></i>
                    </div>

                    <!-- 管理员子菜单 -->
                    <div class="admin-submenu" v-show="!isCollapsed && isAdminMenuOpen">
                        <a v-for="adminTab in adminTabs" :key="adminTab.id" href="#" class="nav-link admin-link"
                            :class="{ 'active': activeTab === adminTab.id }"
                            @click.prevent="$emit('tabChange', adminTab.id)">
                            <i :class="[adminTab.icon, 'nav-icon']"></i>
                            <span class="nav-text">{{ adminTab.name }}</span>
                        </a>
                    </div>
                </li>
            </ul>
        </nav>

        <!-- 侧边栏底部 -->
        <div class="sidebar-footer-container d-none">
            <a href="#" class="sidebar-footer d-lg-flex d-none nav-link" v-if="!isCollapsed"
                @click.prevent="$emit('tabChange', 'profile')">
                <div class="user-info">
                    <div class="user-avatar">
                        <img :src="user?.avatar || 'https://cn1.anndfine.top/downloadfiles/kjcxs:avatar:avatar_default'"
                            alt="用户头像">
                    </div>
                    <div class="user-details">
                        <div class="user-name">{{ user?.name || '加载中...' }}</div>
                        <div class="user-role">{{ user?.isAdmin ? '管理员' : (user?.role || '社团成员') }}</div>
                    </div>
                </div>
            </a>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Tab {
    id: string
    name: string
    icon: string
}

interface User {
    id?: number
    name?: string
    avatar?: string
    role?: string
    isAdmin?: boolean
}

const props = defineProps<{
    activeTab: string
    isCollapsed: boolean
    user: User | null
}>()

defineEmits<{
    tabChange: [tab: string]
    toggle: []
}>()


const tabs: Tab[] = [
    { id: 'dashboard', name: '工作台', icon: 'bi bi-speedometer2' },
    { id: 'devices', name: '设备管理', icon: 'bi bi-cpu' },
    { id: 'attendance', name: '活动考勤', icon: 'bi bi-calendar-check' },
    // { id: 'projects', name: '我的项目', icon: 'bi bi-kanban' },
    // { id: 'profile', name: '个人信息', icon: 'bi bi-person' },
    { id: 'help', name: '使用帮助', icon: 'bi bi-question-circle' },
    { id: 'settings', name: '系统设置', icon: 'bi bi-gear' },
]

const adminTabs: Tab[] = [
    { id: 'add-member', name: '添加成员', icon: 'bi bi-person-plus' },
    { id: 'member-management', name: '成员管理', icon: 'bi bi-people' },
    { id: 'add-group', name: '添加小组', icon: 'bi bi-plus-circle' },
    { id: 'group-management', name: '小组管理', icon: 'bi bi-diagram-3' },
    { id: 'permission-management', name: '权限管理', icon: 'bi bi-shield-check' },
    { id: 'group-permission', name: '小组权限', icon: 'bi bi-lock' },
    { id: 'member-permission', name: '成员权限', icon: 'bi bi-key' },
]

// 然后使用 props.activeTab 而不是重新定义
const isAdminActive = computed(() => {
    return adminTabs.some(tab => tab.id === props.activeTab);
});

// 管理员菜单展开状态
const isAdminMenuOpen = ref(false);

const toggleAdminMenu = () => {
    isAdminMenuOpen.value = !isAdminMenuOpen.value;
};

// 如果当前选中的是管理员菜单，自动展开
if (isAdminActive.value) {
    isAdminMenuOpen.value = true;
}

</script>

<style scoped>
.member-sidebar {
    width: 250px;
    height: 100vh;
    background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    position: fixed;
    top: 60px;
    left: 0;
    transition: all 0.5s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    /* 防止整个侧边栏出现滚动条 */
}

.member-sidebar.collapsed {
    width: 64px;
}

/* 侧边栏头部 */
.sidebar-header {
    padding: 20px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    /* 防止头部被压缩 */
}

.brand {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.1rem;
}

.brand-icon {
    font-size: 1.5rem;
}

.sidebar-toggle {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* 导航菜单 - 添加滚动功能 */
.sidebar-nav {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
    /* 允许垂直滚动 */
    overflow-x: hidden;
    /* 隐藏水平滚动 */
    /* max-height: calc(100vh - 180px); 计算剩余高度 */
}

/* 自定义滚动条样式 */
.sidebar-nav::-webkit-scrollbar {
    width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
}

.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-item {
    margin-bottom: 4px;
}

.nav-link {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.nav-link.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-right: 3px solid #00b4d8;
}

/* 管理员区域样式 */
.admin-section {
    margin-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 16px;
}

.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    transition: background-color 0.3s ease;
    border-radius: 4px;
    margin: 0 4px;
}

.admin-header:hover {
    background: rgba(255, 255, 255, 0.1);
}

.admin-title {
    display: flex;
    align-items: center;
    flex: 1;
}

.admin-chevron {
    font-size: 0.875rem;
    transition: transform 0.3s ease;
    margin-left: 8px;
}

/* 管理员子菜单 */
.admin-submenu {
    padding: 4px 0 4px 24px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 4px 4px;
    margin: 0 8px 8px 8px;
}

.admin-link {
    padding: 10px 12px;
    margin: 2px 0;
    border-radius: 4px;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border-left: 2px solid transparent;
}

.admin-link:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    border-left: 2px solid rgba(255, 255, 255, 0.3);
}

.admin-link.active {
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    border-left: 2px solid #ffd700;
    border-right: none;
}

.nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
    margin-right: 12px;
}

.nav-text {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 收起状态下的工具提示 */
.tooltip {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: #1a1a1a;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1001;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.nav-link:hover .tooltip,
.admin-header:hover .tooltip {
    opacity: 1;
    visibility: visible;
    left: calc(100% + 10px);
}

/* 侧边栏底部 */
.sidebar-footer-container {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    /* 防止底部被压缩 */
    padding: 16px;
}

@media (max-width: 994px) {
    /*.sidebar-footer-container {
        padding: 1px;
    }*/

    .sidebar-nav[data-v-8f24bfcd] {
        padding: 16px 0;
    }
}

.sidebar-footer {
    display: flex;
    width: 100%;
    padding: 0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.user-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
    flex: 1;
    min-width: 0;
    /* 允许文本溢出 */
}

.user-name {
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 767.98px) {
    .member-sidebar {
        transform: translateX(-100%);
        top: 15px;
        height: 100vh;
    }

    .member-sidebar:not(.collapsed) {
        transform: translateX(0);
        width: 280px;
    }

    .member-sidebar.collapsed {
        transform: translateX(-100%);
    }

    .tooltip {
        display: none;
    }

    /* .sidebar-nav {
        max-height: calc(100vh - 140px); 
    } */
}

@media (min-width: 768px) and (max-width: 1199.98px) {
    .member-sidebar:not(.collapsed) {
        width: 200px;
    }

    .nav-text {
        font-size: 0.9rem;
    }

    .brand-text {
        font-size: 1rem;
    }
}

@media (min-width: 992px) {
    .member-sidebar {
        top: 0px;
        height: 100vh;
    }

    .sidebar-nav {
        max-height: calc(100vh - 120px);
    }
}

/* 侧边栏收起时的样式 */
.member-sidebar.collapsed .admin-header {
    justify-content: center;
    padding: 12px 8px;
}

.member-sidebar.collapsed .admin-title {
    justify-content: center;
}

.member-sidebar.collapsed .admin-chevron {
    display: none;
}

.member-sidebar.collapsed .admin-submenu {
    display: none;
}

/* 移动端适配 */
@media (max-height: 600px) {
    .sidebar-nav {
        max-height: calc(100vh - 160px);
    }

    .nav-link {
        padding: 10px 16px;
    }

    .admin-submenu .nav-link {
        padding: 8px 12px;
    }
}
</style>