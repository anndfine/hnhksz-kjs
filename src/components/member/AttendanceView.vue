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
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-primary mb-2">{{ totalCheckins }}</h3>
                        <p class="text-muted mb-0">总打卡次数</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-success mb-2">{{ validCheckins }}</h3>
                        <p class="text-muted mb-0">有效打卡次数</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <h3 class="text-info mb-2">{{ validCheckinRate }}%</h3>
                        <p class="text-muted mb-0">有效打卡率</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
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

        <!-- 操作按钮 -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex gap-2 flex-wrap">
                    <button @click="fetchCheckinRecords" class="btn btn-outline-primary" :disabled="loading">
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
                            <button @click="fetchCheckinRecords" class="btn btn-sm btn-outline-danger ms-2">重试</button>
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
                                        <th>序号</th>
                                        <th>打卡时间</th>
                                        <th>签退时间</th>
                                        <th>时长</th>
                                        <th>状态</th>
                                        <!-- <th>操作</th> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(record, index) in filteredRecords" :key="index"
                                        :class="{ 'table-active': record.status === 'pending' }">
                                        <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                                        <td>
                                            <div>{{ formatTime(record.checkin_time) }}</div>
                                            <small class="text-muted">{{ formatRelativeTime(record.checkin_time)
                                            }}</small>
                                        </td>
                                        <td>
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
                                        <!-- <td>
                                            <button v-if="record.status === 'pending'" @click="showReminder(record)"
                                                class="btn btn-sm btn-outline-warning">
                                                <i class="bi bi-bell me-1"></i>提醒签退
                                            </button>
                                            <button v-else @click="showRecordDetail(record)"
                                                class="btn btn-sm btn-outline-info">
                                                <i class="bi bi-eye me-1"></i>查看
                                            </button>
                                        </td> -->
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
import { ref, onMounted, computed } from 'vue'
import { apinodes } from '@/data/apinodes'
import { showToast } from '@/utils/toast' // 假设有toast工具函数

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

const records = ref<CheckinRecord[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = 10

// 计算属性
const filteredRecords = computed(() => {
    let filtered = records.value

    if (filterStatus.value !== 'all') {
        filtered = filtered.filter(record => record.status === filterStatus.value)
    }

    return filtered.sort((a, b) => b.checkin_time - a.checkin_time) // 按时间倒序
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

const totalCheckins = computed(() => records.value.length)
const validCheckins = computed(() => records.value.filter(record => record.status === 'valid').length)
const pendingCheckins = computed(() => records.value.filter(record => record.status === 'pending').length)
const validCheckinRate = computed(() => {
    const total = records.value.length
    if (total === 0) return 0
    return Math.round((validCheckins.value / total) * 100)
})

const totalDuration = computed(() => {
    return records.value
        .filter(record => record.status === 'valid' && record.duration)
        .reduce((total, record) => total + (record.duration || 0), 0)
})

const averageDuration = computed(() => {
    const validRecords = records.value.filter(record => record.status === 'valid' && record.duration)
    if (validRecords.length === 0) return 0
    return totalDuration.value / validRecords.length
})

// 获取打卡记录
const fetchCheckinRecords = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(`${apinodes[0]!.domain}/api/checkin/mine`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('获取打卡记录失败')
        }

        const result: CheckinResponse = await response.json()

        if (result.success) {
            records.value = result.data.records
            showToast('success', '打卡记录加载成功')
        } else {
            throw new Error(result.message || '获取打卡记录失败')
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : '未知错误'
        error.value = message
        showToast('error', `加载失败: ${message}`)
        console.error('获取打卡记录失败:', err)
    } finally {
        loading.value = false
    }
}

// 格式化时间戳
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

// 格式化相对时间
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

// 格式化时长（毫秒转小时分钟）
const formatDuration = (duration: number | null): string => {
    if (!duration || duration === 0) return '-'
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
        return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
    const classes = {
        'valid': 'bg-success',
        'invalid': 'bg-danger',
        'pending': 'bg-warning'
    }
    return classes[status as keyof typeof classes] || 'bg-secondary'
}

// 获取状态图标
const getStatusIcon = (status: string): string => {
    const icons = {
        'valid': 'bi bi-check-circle',
        'invalid': 'bi bi-x-circle',
        'pending': 'bi bi-clock'
    }
    return icons[status as keyof typeof icons] || 'bi bi-question-circle'
}

// 获取状态文本
const getStatusText = (status: string): string => {
    const texts = {
        'valid': '有效',
        'invalid': '无效',
        'pending': '进行中'
    }
    return texts[status as keyof typeof texts] || '未知'
}

// 显示记录详情
const showRecordDetail = (record: CheckinRecord) => {
    // 这里可以显示模态框或跳转到详情页
    showToast('info', `查看记录详情: ${formatTime(record.checkin_time)}`)
}

// 提醒签退
const showReminder = (record: CheckinRecord) => {
    showToast('warning', '请记得及时签退，避免记录失效！', 5000)
}

// 导出记录
const exportRecords = () => {
    showToast('info', '导出功能开发中...')
}

// 监听筛选条件变化重置页码
// watch(filterStatus, () => {
//     currentPage.value = 1
// })

// 组件挂载时获取数据
onMounted(() => {
    fetchCheckinRecords()
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
</style>