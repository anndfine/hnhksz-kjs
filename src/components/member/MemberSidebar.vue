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
        <div class="sidebar-footer d-lg-flex d-none" v-if="!isCollapsed">
            <div class="user-info">
                <div class="user-avatar">
                    <img src="https://picsum.photos/seed/member-avatar/40/40.jpg" alt="用户头像">
                </div>
                <div class="user-details">
                    <div class="user-name">张三</div>
                    <div class="user-role">社团成员</div>
                </div>
            </div>
        </div>
        <!-- 导航菜单 -->
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <li v-for="tab in tabs" :key="tab.id" class="nav-item">
                    <a href="#" class="nav-link" :class="{ 'active': activeTab === tab.id }"
                        @click.prevent="$emit('tabChange', tab.id)">
                        <i :class="[tab.icon, 'nav-icon']"></i>
                        <span class="nav-text" v-if="!isCollapsed">{{ tab.name }}</span>
                        <span class="tooltip" v-if="isCollapsed">{{ tab.name }}</span>
                    </a>
                </li>
            </ul>
        </nav>

    </aside>
</template>

<script setup lang="ts">
interface Tab {
    id: string
    name: string
    icon: string
}

defineProps<{
    activeTab: string
    isCollapsed: boolean
}>()

defineEmits<{
    tabChange: [tab: string]
    toggle: []
}>()

const tabs: Tab[] = [
    { id: 'dashboard', name: '工作台', icon: 'bi bi-speedometer2' },
    { id: 'devices', name: '设备管理', icon: 'bi bi-cpu' },
    { id: 'attendance', name: '活动考勤', icon: 'bi bi-calendar-check' },
    { id: 'projects', name: '我的项目', icon: 'bi bi-kanban' },
    { id: 'profile', name: '个人信息', icon: 'bi bi-person' },
    { id: 'help', name: '使用帮助', icon: 'bi bi-question-circle' },
    { id: 'settings', name: '系统设置', icon: 'bi bi-gear' }
]
</script>

<style scoped>
.member-sidebar {
    max-height: calc(100vh - 60px);
    width: 250px;
    height: 100vh;
    background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    position: fixed;
    top: 60px;
    left: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
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

/* 导航菜单 */
.sidebar-nav {
    flex: 1;
    padding: 16px 0;
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

.nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
    margin-right: 12px;
}

.nav-text {
    font-weight: 500;
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

.nav-link:hover .tooltip {
    opacity: 1;
    visibility: visible;
    left: calc(100% + 10px);
}

/* 侧边栏底部 */
.sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
    flex: 1;
}

.user-name {
    font-weight: 600;
    font-size: 0.9rem;
}

.user-role {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
}

/* 响应式设计 */
@media (max-width: 767.98px) {
    .member-sidebar {
        transform: translateX(-100%);
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
        max-height: calc(100vh - 0px);
    }
}
</style>