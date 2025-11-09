<!-- src/components/member/DashboardView.vue -->
<template>
    <div class="dashboard-view">
        <!-- 统计卡片 -->
        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-primary text-white rounded-circle me-3">
                                <i class="bi bi-calendar-check"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.todayAttendance }}</h4>
                                <p class="stat-label text-muted mb-0">今日打卡</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-success text-white rounded-circle me-3">
                                <i class="bi bi-cpu"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.onlineDevices }}</h4>
                                <p class="stat-label text-muted mb-0">在线设备</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-warning text-white rounded-circle me-3">
                                <i class="bi bi-kanban"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.activeProjects }}</h4>
                                <p class="stat-label text-muted mb-0">进行中项目</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-info text-white rounded-circle me-3">
                                <i class="bi bi-bell"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.unreadNotifications }}</h4>
                                <p class="stat-label text-muted mb-0">未读消息</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- 左侧内容 -->
            <div class="col-lg-8">
                <!-- 今日待办事项 -->
                <div class="card border-0 shadow-sm mb-4 d-none">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-list-check text-primary me-2"></i>
                                今日待办事项
                            </h5>
                            <span class="badge bg-primary">{{ todos.length }} 项</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="todo-list">
                            <div v-for="todo in todos" :key="todo.id"
                                class="todo-item d-flex align-items-center py-2 border-bottom">
                                <div class="form-check me-3">
                                    <input class="form-check-input" type="checkbox" :id="'todo-' + todo.id"
                                        v-model="todo.completed">
                                </div>
                                <label class="form-check-label flex-grow-1" :for="'todo-' + todo.id"
                                    :class="{ 'text-muted text-decoration-line-through': todo.completed }">
                                    {{ todo.title }}
                                </label>
                                <span class="badge" :class="getPriorityBadgeClass(todo.priority)">
                                    {{ todo.priority }}
                                </span>
                            </div>
                            <div v-if="todos.length === 0" class="text-center py-4 text-muted">
                                <i class="bi bi-check-circle display-4 mb-2"></i>
                                <p>今日没有待办事项</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 通知 -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-megaphone text-danger me-2"></i>
                            系统公告
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="announcement-list">
                            <div v-for="announcement in announcements" :key="announcement.id"
                                class="announcement-item py-3 border-bottom">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="mb-0 text-primary">{{ announcement.title }}</h6>
                                    <span class="badge" :class="getAnnouncementTypeClass(announcement.type)">
                                        {{ announcement.type }}
                                    </span>
                                </div>
                                <!-- <div class="text-muted mb-1">{{ announcement.content }}</div> -->
                                <!-- <div class="d-flex justify-content-between align-items-center d-none mt-1">
                                    <small class="text-muted">
                                        <i class="bi bi-clock me-1"></i>{{ announcement.time }}
                                    </small>
                                    <small class="text-muted">
                                        <i class="bi bi-person me-1"></i>{{ announcement.publisher }}
                                    </small>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 设备状态概览 -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-cpu text-success me-2"></i>
                            设备状态概览
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="device-overview">
                            <div v-for="device in devices" :key="device.id"
                                class="device-item d-flex align-items-center justify-content-between py-2 border-bottom">
                                <div class="device-info d-flex align-items-center">
                                    <i
                                        :class="[device.icon, 'me-3', device.status === '在线' ? 'text-success' : 'text-danger']"></i>
                                    <div>
                                        <h6 class="mb-0">{{ device.name }}</h6>
                                        <small class="text-muted">{{ device.type }}</small>
                                    </div>
                                </div>
                                <div class="device-status">
                                    <span class="badge" :class="device.status === '在线' ? 'bg-success' : 'bg-danger'">
                                        {{ device.status }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧内容 -->
            <div class="col-lg-4">
                <!-- 快速操作入口 -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-lightning text-success me-2"></i>
                            快速操作
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="quick-actions">
                            <div class="row g-2">
                                <div class="col-6" v-for="action in quickActions" :key="action.id">
                                    <button class="btn btn-outline-primary w-100 h-100 py-3"
                                        @click="handleQuickAction(action.id)">
                                        <i :class="[action.icon, 'mb-2 d-block']"></i>
                                        <small>{{ action.name }}</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 最新消息提醒 -->
                <div class="card border-0 shadow-sm mb-4 d-none">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-bell text-warning me-2"></i>
                                最新消息
                            </h5>
                            <span class="badge bg-warning">{{ unreadNotifications.length }} 未读</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="notification-list">
                            <div v-for="notification in notifications" :key="notification.id"
                                class="notification-item py-2 border-bottom" :class="{ 'unread': !notification.read }">
                                <div class="d-flex align-items-start">
                                    <i
                                        :class="[notification.icon, 'me-2 mt-1', notification.type === 'important' ? 'text-danger' : 'text-primary']"></i>
                                    <div class="flex-grow-1">
                                        <p class="mb-1 small">{{ notification.message }}</p>
                                        <small class="text-muted">{{ notification.time }}</small>
                                    </div>
                                    <button v-if="!notification.read" class="btn btn-sm btn-outline-primary ms-2"
                                        @click="markAsRead(notification.id)">
                                        <i class="bi bi-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 最近活动提醒 -->
                <div class="card border-0 shadow-sm mb-4 d-none">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-clock-history text-info me-2"></i>
                            最近活动
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="activity-list">
                            <div v-for="activity in recentActivities" :key="activity.id"
                                class="activity-item py-2 border-bottom">
                                <div class="d-flex align-items-start">
                                    <i :class="[activity.icon, 'me-2 mt-1 text-primary']"></i>
                                    <div>
                                        <p class="mb-1 small">{{ activity.description }}</p>
                                        <small class="text-muted">{{ activity.time }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <!-- 系统公告 -->
        <!-- <div class="row mt-4">
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apinodes } from '@/data/apinodes'
import toast, { showToast } from '@/utils/toast'
import {
    getCheckinData,
    getTodayCheckinCount,
    getTodayDuration,
    hasCachedData,
    isLoading
} from '@/components/member/attendanceService.ts'

// 打卡数据接口
interface CheckinRecord {
    user_id: number
    status: 'valid' | 'invalid' | 'pending'
    checkin_time: number
    checkout_time: number | null
    duration: number | null
}

interface CheckinResponse {
    success: boolean
    message: string
    data: {
        records: CheckinRecord[]
    }
    time: number
}

// 打卡数据
const checkinRecords = ref<CheckinRecord[]>([])
const checkinLoading = ref(false)

// 统计数据
const stats = ref({
    todayAttendance: 0, // 将从打卡数据计算
    onlineDevices: 0,
    activeProjects: 0,
    unreadNotifications: 0
})

// 今日打卡统计计算
const todayCheckinStats = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const todayRecords = checkinRecords.value.filter(record => {
        const recordDate = new Date(record.checkin_time)
        recordDate.setHours(0, 0, 0, 0)
        return recordDate.getTime() === todayTimestamp
    })

    const todayValidRecords = todayRecords.filter(record => record.status === 'valid')
    const totalDuration = todayValidRecords.reduce((total, record) => total + (record.duration || 0), 0)

    return {
        todayCheckinCount: todayRecords.length,
        todayValidDuration: totalDuration,
        hasPendingCheckin: todayRecords.some(record => record.status === 'pending')
    }
})

// 获取打卡数据
const fetchCheckinData = async (forceRefresh: boolean = false) => {
    try {
        await getCheckinData(forceRefresh)
        // 更新今日打卡次数显示
        stats.value.todayAttendance = getTodayCheckinCount()
    } catch (err) {
        const message = err instanceof Error ? err.message : '未知错误'
        console.error('获取打卡数据失败:', err)
        // 静默失败，不影响Dashboard其他功能
    }
}

// 刷新数据（供外部调用）
const refreshCheckinData = () => {
    getCheckinData(true).then(() => {
        stats.value.todayAttendance = getTodayCheckinCount()
    })
}


// 待办事项
const todos = ref([
    { id: 1, title: '完成物联网设备调试报告', completed: false, priority: '高' },
    { id: 2, title: '参加下午的技术分享会', completed: false, priority: '中' },
    { id: 3, title: '提交项目进度更新', completed: true, priority: '中' },
    { id: 4, title: '学习新的传感器技术文档', completed: false, priority: '低' }
])

// 设备状态
const devices = ref([
    { id: 0, name: 'VL-C7A-Linux-Linux', type: '服务器节点', status: '在线', icon: 'bi bi-server' },
    { id: 1, name: '温湿度传感器', type: '环境监测', status: '离线', icon: 'bi bi-thermometer' },
    { id: 2, name: '智能LED控制器', type: '照明控制', status: '离线', icon: 'bi bi-lightbulb' },
    { id: 3, name: 'Arduino主控板', type: '核心控制', status: '离线', icon: 'bi bi-motherboard' },
    { id: 4, name: 'OLED显示屏', type: '信息显示', status: '离线', icon: 'bi bi-display' }
])

// 消息通知
const notifications = ref([
    { id: 1, message: '您有一个新的设备借用申请待审批', type: 'important', read: false, time: '10分钟前', icon: 'bi bi-cpu' },
    { id: 2, message: '本周技术培训通知：物联网协议解析', type: 'info', read: false, time: '1小时前', icon: 'bi bi-megaphone' },
    { id: 3, message: '您的项目"智能校园"有新评论', type: 'info', read: true, time: '2小时前', icon: 'bi bi-chat' },
    { id: 4, message: '系统维护通知：今晚22:00-24:00', type: 'important', read: false, time: '3小时前', icon: 'bi bi-tools' }
])

// 最近活动
const recentActivities = ref([
    { id: 1, description: '完成了设备调试任务', time: '刚刚', icon: 'bi bi-check-circle' },
    { id: 2, description: '提交了项目进度报告', time: '30分钟前', icon: 'bi bi-upload' },
    { id: 3, description: '参加了社团例会', time: '2小时前', icon: 'bi bi-people' },
    { id: 4, description: '借用了Arduino开发板', time: '4小时前', icon: 'bi bi-cpu' }
])

// 快速操作
const quickActions = ref([
    // { id: 'checkin', name: '立即打卡', icon: 'bi bi-check-circle' },
    // { id: 'addDevice', name: '添加设备', icon: 'bi bi-plus-circle' },
    { id: 'refreshCheckin', name: '刷新打卡', icon: 'bi bi-arrow-clockwise' },
    { id: 'newProject', name: '新建项目', icon: 'bi bi-plus-lg' },
    { id: 'report', name: '问题反馈', icon: 'bi bi-bug' }
])

// 系统公告
const announcements = ref([
    {
        id: 1,
        title: '关于成员系统持续维护的通知',
        type: '重要',
        time: '2025-11-01',
        publisher: '科技社成员系统管理团队'
    },
    // {
    //     id: 1,
    //     title: '关于举办科技创新大赛的通知',
    //     content: '为激发同学们的创新热情，科技社将举办年度科技创新大赛，欢迎各位同学踊跃报名参加。',
    //     type: '重要',
    //     time: '2024-01-15',
    //     publisher: '科技社管理组'
    // },
    // {
    //     id: 2,
    //     title: '新设备入库通知',
    //     content: '最新一批物联网开发设备已入库，包括多种传感器和控制器，欢迎同学们申请使用。',
    //     type: '通知',
    //     time: '2024-01-14',
    //     publisher: '设备管理组'
    // },
    // {
    //     id: 3,
    //     title: '寒假实验室开放安排',
    //     content: '寒假期间实验室将继续开放，具体时间安排请查看详细通知。',
    //     type: '安排',
    //     time: '2024-01-13',
    //     publisher: '实验室管理组'
    // }
])

// 组件挂载时获取数据
onMounted(() => {
    // 如果有缓存数据，直接使用，否则获取新数据
    if (!hasCachedData()) {
        showToast('info', 'DashboardView 已加载')
        fetchCheckinData(true)
    } else {
        stats.value.todayAttendance = getTodayCheckinCount()
    }
})

// 快速操作处理
const handleQuickAction = (actionId: string) => {
    switch (actionId) {
        case 'refreshCheckin':
            refreshCheckinData()
            break
        case 'newProject':
            showToast("info", '功能开发中...')
            break
        case 'report':
            showToast('info', '功能开发中...')
            break
    }
}

// 标记通知为已读
const markAsRead = (notificationId: number) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
        notification.read = true
        showToast('success', '标记为已读')
    }
}

// 获取优先级徽章类

// 计算属性
const unreadNotifications = computed(() => notifications.value.filter(n => !n.read))

// 方法
const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
        case '高': return 'bg-danger'
        case '中': return 'bg-warning'
        case '低': return 'bg-secondary'
        default: return 'bg-secondary'
    }
}

// 获取公告类型类
const getAnnouncementTypeClass = (type: string) => {
    switch (type) {
        case '重要': return 'bg-danger'
        case '通知': return 'bg-primary'
        case '安排': return 'bg-success'
        case '通知': return 'bg-info'
        case '更新': return 'bg-success'
        default: return 'bg-secondary'
    }
}





// 暴露方法供外部调用
defineExpose({
    refreshCheckinData,
    getTodayDuration
})
</script>

<style scoped>
.dashboard-view {
    padding: 0;
}

.stat-card {
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e3c72;
}

.stat-label {
    font-size: 0.875rem;
}

.todo-item:hover {
    background-color: #f8f9fa;
    border-radius: 4px;
}

.notification-item.unread {
    background-color: #fff3cd;
    border-radius: 4px;
    padding: 8px;
    margin: -8px;
}

.device-item:hover,
.activity-item:hover {
    background-color: #f8f9fa;
    border-radius: 4px;
}

.quick-actions .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
}

.announcement-item:hover {
    background-color: #f8f9fa;
    border-radius: 4px;
}

.card {
    border-radius: 12px;
}

.card-header {
    padding: 20px 20px 0;
}

.card-body {
    padding: 20px;
}
</style>