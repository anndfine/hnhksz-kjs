<!-- src/components/member/AttendanceView.vue -->
<template>
    <div class="tab-content">
        <div class="row mb-4">
            <div class="col-12">
                <p class="lead text-muted">查看活动打卡记录</p>
            </div>
        </div>

        <!-- 统计信息卡片 -->
        <div class="row mb-4">
            <div class="col mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-primary mb-2">{{ totalCheckins }}</h3>
                        <p class="text-muted mb-0">总打卡次数</p>
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-success mb-2">{{ validCheckins }}</h3>
                        <p class="text-muted mb-0">有效打卡次数</p>
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-info mb-2">{{ validCheckinRate }}%</h3>
                        <p class="text-muted mb-0">有效打卡率</p>
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-warning mb-2">{{ pendingCheckins }}</h3>
                        <p class="text-muted mb-0">进行中</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 时长统计 -->
        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-primary mb-2">{{ formatDuration(totalDuration) }}</h3>
                        <p class="text-muted mb-0">总有效时长</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-secondary mb-2">{{ formatDuration(averageDuration) }}</h3>
                        <p class="text-muted mb-0">平均单次时长</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 状态提醒横幅 -->
        <div v-if="showStatusAlert" class="row mb-4">
            <div class="col-12">
                <div :class="['alert', statusAlertClass, 'd-flex', 'align-items-center']" role="alert">
                    <i :class="statusAlertIcon" class="me-2 fs-5"></i>
                    <div class="flex-grow-1">
                        <strong>{{ statusAlertTitle }}</strong>
                        <div class="small">{{ statusAlertMessage }}</div>
                    </div>
                    <button type="button" class="btn-close" @click="dismissStatusAlert"></button>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex gap-2 flex-wrap">
                    <button @click="callupdateCheckin" class="btn btn-outline-primary" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        {{ loading ? '刷新中...' : '刷新记录' }}
                    </button>
                    <button @click="exportRecords" class="btn btn-outline-success">
                        <i class="bi bi-download me-2"></i>导出记录
                    </button>
                    <div class="ms-auto">
                        <select v-model="filterStatus" class="form-select" style="width: auto;">
                            <option value="all">全部状态</option>
                            <option value="valid">有效</option>
                            <option value="invalid">无效</option>
                            <option value="pending">进行中</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- 打卡记录列表 -->
        <div class="row">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">打卡记录</h5>
                        <span class="text-muted small">共 {{ filteredRecords.length }} 条记录</span>
                    </div>
                    <div class="card-body">
                        <div v-if="loading" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">加载中...</span>
                            </div>
                            <p class="mt-2 text-muted">正在加载打卡记录...</p>
                        </div>
                        <div v-else-if="error" class="alert alert-danger" role="alert">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ error }}
                            <button @click="callupdateCheckin" class="btn btn-sm btn-outline-danger ms-2">重试</button>
                        </div>
                        <div v-else-if="records.length === 0" class="text-center py-5 text-muted">
                            <i class="bi bi-clock-history display-4 d-block mb-3"></i>
                            <p class="mb-0">暂无打卡记录</p>
                            <small>开始打卡后，记录将显示在这里</small>
                        </div>
                        <div v-else-if="filteredRecords.length === 0" class="text-center py-4 text-muted">
                            没有找到匹配的记录
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th class="hide-below-md">序号</th>
                                        <th class="hide-below-lg">打卡时间</th>
                                        <th>签退时间</th>
                                        <th>时长</th>
                                        <th>状态</th>
                                        <th class="d-none">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(record, index) in paginatedRecords" :key="index"
                                        :class="{ 'table-active': record.status === 'pending' }">
                                        <td class="hide-below-md">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                                        <td>
                                            <div>{{ formatTime(record.checkin_time) }}</div>
                                            <small class="text-muted">{{ formatRelativeTime(record.checkin_time)
                                            }}</small>
                                        </td>
                                        <td class="hide-below-lg">
                                            <div>{{ formatTime(record.checkout_time) }}</div>
                                            <small v-if="record.checkout_time" class="text-muted">
                                                {{ formatRelativeTime(record.checkout_time) }}
                                            </small>
                                        </td>
                                        <td>
                                            <span v-if="record.status === 'pending'" class="text-warning">
                                                <i class="bi bi-clock me-1"></i>进行中
                                            </span>
                                            <span v-else-if="record.duration">
                                                {{ formatDuration(record.duration) }}
                                            </span>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <span :class="getStatusClass(record.status)" class="badge">
                                                <i :class="getStatusIcon(record.status)" class="me-1"></i>
                                                {{ getStatusText(record.status) }}
                                            </span>
                                        </td>
                                        <td class="d-none">
                                            <button v-if="record.status === 'pending'" @click="showReminder(record)"
                                                class="btn btn-sm btn-outline-warning">
                                                <i class="bi bi-bell me-1"></i>提醒签退
                                            </button>
                                            <button v-else @click="showRecordDetail(record)"
                                                class="btn btn-sm btn-outline-info">
                                                <i class="bi bi-eye me-1"></i>查看
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- 分页 -->
                            <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
                                <div class="text-muted small">
                                    显示第 {{ (currentPage - 1) * pageSize + 1 }} 到
                                    {{ Math.min(currentPage * pageSize, filteredRecords.length) }} 条，共 {{
                                        filteredRecords.length }} 条
                                </div>
                                <nav>
                                    <ul class="pagination mb-0">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link" @click="currentPage--">上一页</button>
                                        </li>
                                        <li v-for="page in visiblePages" :key="page" class="page-item"
                                            :class="{ active: page === currentPage }">
                                            <button class="page-link" @click="currentPage = page">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link" @click="currentPage++">下一页</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { toast } from '@/utils/toast'
import {
    getCheckinData,
    formatDuration,
    getTotalStats,
    isLoading,
    type CheckinRecord
} from './attendanceService'

const records = ref<CheckinRecord[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = 10
const dismissedAlerts = ref<Set<string>>(new Set())

// 计算属性
const filteredRecords = computed(() => {
    let filtered = records.value

    if (filterStatus.value !== 'all') {
        filtered = filtered.filter(record => record.status === filterStatus.value)
    }

    return filtered.sort((a, b) => b.checkin_time - a.checkin_time)
})

const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredRecords.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
    return Math.ceil(filteredRecords.value.length / pageSize)
})

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + 4)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

// 使用服务中的统计计算
const totalStats = computed(() => getTotalStats())
const totalCheckins = computed(() => totalStats.value.totalCheckins)
const validCheckins = computed(() => totalStats.value.validCheckins)
const pendingCheckins = computed(() => totalStats.value.pendingCheckins)
const validCheckinRate = computed(() => totalStats.value.validCheckinRate)
const totalDuration = computed(() => totalStats.value.totalDuration)
const averageDuration = computed(() => totalStats.value.averageDuration)

// 最新记录状态检查
const latestRecord = computed(() => {
    return records.value.length > 0 ? records.value[0] : null
})

const hasLongPendingRecord = computed(() => {
    if (!latestRecord.value || latestRecord.value.status !== 'pending') return false

    const pendingTime = Date.now() - latestRecord.value.checkin_time
    return pendingTime > 40 * 60 * 1000 // 超过40分钟
})

const showStatusAlert = computed(() => {
    if (!latestRecord.value) return false

    const alertKey = `${latestRecord.value.status}_${latestRecord.value.checkin_time}`
    if (dismissedAlerts.value.has(alertKey)) return false

    return latestRecord.value.status === 'invalid' ||
        latestRecord.value.status === 'pending' ||
        hasLongPendingRecord.value
})

const statusAlertClass = computed(() => {
    if (latestRecord.value?.status === 'invalid') return 'alert-danger'
    if (hasLongPendingRecord.value) return 'alert-warning'
    if (latestRecord.value?.status === 'pending') return 'alert-info'
    return 'alert-secondary'
})

const statusAlertIcon = computed(() => {
    if (latestRecord.value?.status === 'invalid') return 'bi bi-exclamation-triangle'
    if (hasLongPendingRecord.value) return 'bi bi-clock-history'
    if (latestRecord.value?.status === 'pending') return 'bi bi-info-circle'
    return 'bi bi-bell'
})

const statusAlertTitle = computed(() => {
    if (latestRecord.value?.status === 'invalid') return '最新记录无效'
    if (hasLongPendingRecord.value) return '长时间未签退'
    if (latestRecord.value?.status === 'pending') return '有进行中的打卡'
    return '状态提醒'
})

const statusAlertMessage = computed(() => {
    if (latestRecord.value?.status === 'invalid') {
        return '最新打卡记录被系统标记为无效，请检查打卡时间。有疑问请联系管理员。'
    }
    if (hasLongPendingRecord.value) {
        const pendingMinutes = Math.floor((Date.now() - (latestRecord.value?.checkin_time || 0)) / (1000 * 60))
        return `已经 ${pendingMinutes} 分钟未签退，请及时签退以避免记录失效。`
    }
    if (latestRecord.value?.status === 'pending') {
        const pendingMinutes = Math.floor((Date.now() - latestRecord.value.checkin_time) / (1000 * 60))
        return `进行中的打卡记录，已持续 ${pendingMinutes} 分钟，请记得签退。`
    }
    return ''
})

// 方法
const dismissStatusAlert = () => {
    if (latestRecord.value) {
        const alertKey = `${latestRecord.value.status}_${latestRecord.value.checkin_time}`
        dismissedAlerts.value.add(alertKey)
    }
}

const checkAndShowStatusToasts = () => {
    if (!latestRecord.value) return

    // 避免重复提示
    const alertKey = `toast_${latestRecord.value.status}_${latestRecord.value.checkin_time}`
    if (sessionStorage.getItem(alertKey)) return

    if (latestRecord.value.status === 'invalid') {
        toast.warning('最新打卡记录被标记为无效，请检查打卡时间。', 8000)
    } else if (hasLongPendingRecord.value) {
        const pendingMinutes = Math.floor((Date.now() - latestRecord.value.checkin_time) / (1000 * 60))
        toast.warning(`长时间未签退警告：已持续 ${pendingMinutes} 分钟，未及时签退将导致记录无效！`, 10000)
    } else if (latestRecord.value.status === 'pending') {
        const pendingMinutes = Math.floor((Date.now() - latestRecord.value.checkin_time) / (1000 * 60))
        if (pendingMinutes > 10) { // 10分钟以上才提示
            toast.info(`提醒：进行中的打卡，已持续 ${pendingMinutes} 分钟`, 6000)
        }
    }

    // 标记为已提示
    sessionStorage.setItem(alertKey, 'true')
    // 2小时后清除标记
    setTimeout(() => {
        sessionStorage.removeItem(alertKey)
    }, 2 * 60 * 60 * 1000)
}

// 更新打卡记录状态
const callupdateCheckin = async () => {
    loading.value = false
    try {
        toast.info('更新打卡记录...', 3000)
        loading.value = true
        // 刷新记录列表
        await getCheckinData(true)
        await fetchCheckinRecords()
        // toast.success('打卡记录已更新', 3000)
        loading.value = false
    } catch (err) {
        toast.error('更新失败，请稍后重试', 3000)
        loading.value = false
    }
}

// 获取打卡记录
const fetchCheckinRecords = async () => {
    error.value = null

    try {
        loading.value = true
        const data = await getCheckinData()
        records.value = data

        // 检查并显示状态提醒
        setTimeout(() => {
            checkAndShowStatusToasts()
        }, 1000)
        loading.value = false

    } catch (err) {
        const message = err instanceof Error ? err.message : '未知错误'
        error.value = message
        console.error('获取打卡记录失败:', err)
    }
}

// 导出记录
const exportRecords = () => {
    toast.info('导出功能开发中...', 3000)
}

// 格式化方法
const formatTime = (timestamp: number | null): string => {
    if (!timestamp || timestamp === 0) return '-'
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'valid': return 'bg-success'
        case 'invalid': return 'bg-danger'
        case 'pending': return 'bg-warning'
        default: return 'bg-secondary'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'valid': return 'bi bi-check-circle'
        case 'invalid': return 'bi bi-x-circle'
        case 'pending': return 'bi bi-clock'
        default: return 'bi bi-question-circle'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'valid': return '有效'
        case 'invalid': return '无效'
        case 'pending': return '进行中'
        default: return status
    }
}

const showReminder = (record: CheckinRecord) => {
    toast.info('提醒功能开发中...', 3000)
}

const showRecordDetail = (record: CheckinRecord) => {
    toast.info('详情功能开发中...', 3000)
}

// 组件挂载时获取数据
onMounted(() => {
    fetchCheckinRecords()
})

// 监听过滤状态变化，重置页码
watch(filterStatus, () => {
    currentPage.value = 1
})
</script>

<style scoped>
.table-responsive {
    border-radius: 0.5rem;
}

.badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.page-link {
    cursor: pointer;
}

.table-active {
    background-color: rgba(255, 193, 7, 0.1);
}

.alert {
    border-left: 4px solid;
}

.alert-danger {
    border-left-color: #dc3545;
}

.alert-warning {
    border-left-color: #ffc107;
}

.alert-info {
    border-left-color: #17a2b8;
}

@media (max-width: 768px) {
    .hide-below-md {
        display: none;
    }
}

@media (max-width: 992px) {
    .hide-below-lg {
        display: none;
    }
}
</style>