import { ref, computed } from 'vue'
import { apinodes } from '@/data/apinodes'
import { toast } from '@/utils/toast'

// 打卡数据接口
export interface CheckinRecord {
    user_id: number
    status: 'valid' | 'invalid' | 'pending'
    checkin_time: number
    checkout_time: number | null
    duration: number | null
}

export interface CheckinResponse {
    success: boolean
    message: string
    data: {
        records: CheckinRecord[]
    }
    time: number
}

// 共享的打卡数据
const checkinRecords = ref<CheckinRecord[]>([])
const loading = ref(false)
const lastFetchTime = ref<number>(0)
const dataExpiryTime = 5 * 60 * 1000 // 5分钟缓存

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

// 总统计计算
const totalStats = computed(() => {
    const totalCheckins = checkinRecords.value.length
    const validCheckins = checkinRecords.value.filter(record => record.status === 'valid').length
    const pendingCheckins = checkinRecords.value.filter(record => record.status === 'pending').length
    const validCheckinRate = totalCheckins > 0 ? Math.round((validCheckins / totalCheckins) * 100) : 0

    const totalDuration = checkinRecords.value
        .filter(record => record.status === 'valid' && record.duration)
        .reduce((total, record) => total + (record.duration || 0), 0)

    const averageDuration = validCheckins > 0 ? totalDuration / validCheckins : 0

    return {
        totalCheckins,
        validCheckins,
        pendingCheckins,
        validCheckinRate,
        totalDuration,
        averageDuration
    }
})

// 获取打卡数据（带缓存）
export const getCheckinData = async (forceRefresh = false): Promise<CheckinRecord[]> => {
    const now = Date.now()
    
    // 检查缓存是否有效
    if (!forceRefresh && checkinRecords.value.length > 0 && now - lastFetchTime.value < dataExpiryTime) {
        return checkinRecords.value
    }

    loading.value = true

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
            checkinRecords.value = result.data.records
            lastFetchTime.value = now
            
            if (forceRefresh) {
                toast.success('打卡记录已刷新', 3000)
            }
            
            return checkinRecords.value
        } else {
            throw new Error(result.message || '获取打卡记录失败')
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : '未知错误'
        console.error('获取打卡数据失败:', err)
        
        if (forceRefresh) {
            toast.error(`刷新失败: ${message}`, 5000)
        }
        
        throw err
    } finally {
        loading.value = false
    }
}

// 获取今日打卡时长
export const getTodayDuration = (): string => {
    const hours = Math.floor(todayCheckinStats.value.todayValidDuration / (1000 * 60 * 60))
    const minutes = Math.floor((todayCheckinStats.value.todayValidDuration % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
        return `${hours}小时${minutes}分钟`
    }
    return minutes > 0 ? `${minutes}分钟` : '无记录'
}

// 获取今日打卡次数
export const getTodayCheckinCount = (): number => {
    return todayCheckinStats.value.todayCheckinCount
}

// 格式化时长显示
export const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
        return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
}

// 获取总统计信息
export const getTotalStats = () => {
    return totalStats.value
}

// 获取今日统计信息
export const getTodayStats = () => {
    return todayCheckinStats.value
}

// 检查是否有缓存数据
export const hasCachedData = (): boolean => {
    return checkinRecords.value.length > 0 && Date.now() - lastFetchTime.value < dataExpiryTime
}

// 获取加载状态
export const isLoading = () => {
    return loading.value
}

// 清空缓存（用于登出等情况）
export const clearCache = () => {
    checkinRecords.value = []
    lastFetchTime.value = 0
}

export default {
    getCheckinData,
    getTodayDuration,
    getTodayCheckinCount,
    formatDuration,
    getTotalStats,
    getTodayStats,
    hasCachedData,
    isLoading,
    clearCache
}
