<template>
    <div class="dashboard">

        <!-- 顶部时间 -->
        <div class="time">{{ currentTime }}</div>

        <!-- 统计信息 -->
        <div class="stats">
            <div class="stat-row single" v-if="isLongDuration">
                <div class="stat-card">{{ stats.totalDuration }}</div>
            </div>
            <div :class="['stat-row', isLongDuration ? 'compact' : 'single']">
                <div class="stat-card">今日 {{ stats.today }}</div>
                <div class="stat-card">进行中 {{ stats.ongoing }}</div>
                <div class="stat-card">总次数 {{ stats.totalTimes }}</div>
            </div>
        </div>

        <!-- Tab -->
        <div class="tabs">
            <div class="tab" :class="{ active: currentTab === 'dynamic' }" @click="currentTab = 'dynamic'">最新动态</div>
            <div class="tab" :class="{ active: currentTab === 'rank' }" @click="currentTab = 'rank'">排行</div>
        </div>

        <!-- 内容区域 -->
        <div class="content-area">

            <!-- 最新动态页（重点） -->
            <div v-if="currentTab === 'dynamic'" class="dynamic-page">
                <transition-group name="slide-fade" tag="div" class="dynamic-list">
                    <div v-for="item in limitedDynamics" :key="item.id"
                        :class="['dynamic-item', { 'is-new': item.isNew }]" @animationend="item.isNew = false">
                        <div class="left-bar" :class="item.action"></div>

                        <img class="avatar" :src="item.avatar" alt="avatar">

                        <div class="info">
                            <div class="name">{{ item.name }}</div>
                            <div class="time-small">{{ item.time }}</div>
                        </div>

                        <div class="action">
                            <span v-if="item.action === 'checkin'" class="icon-checkin">⬆</span>
                            <span v-if="item.action === 'checkout'" class="icon-checkout">⬇</span>
                            <span class="label">{{ item.action === 'checkin' ? '签到' : '签退' }}</span>
                        </div>
                    </div>
                </transition-group>
            </div>

            <!-- 排行页（简易版，可自行替换） -->
            <div v-else class="rank-page">
                <div class="rank-item" v-for="r in rank" :key="r.name">
                    <div class="rank-name">{{ r.name }}</div>
                    <div class="rank-value">{{ r.value }} h</div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

/* 时间 */
const currentTime = ref('00:00:00')
setInterval(() => {
    const d = new Date()
    currentTime.value = d.toLocaleTimeString('zh-CN', { hour12: false })
}, 1000)

/* 统计信息 */
const stats = ref({
    totalDuration: '总时长 221 小时 40 分钟',
    today: 34,
    ongoing: 8,
    totalTimes: 248
})

const isLongDuration = computed(() => stats.value.totalDuration.length > 12)

/* Tab */
const currentTab = ref('dynamic')

/* 动态（下面 fetchDynamic() 会填充） */
const dynamics = ref([])

/* 限制条数：自动压缩 48px 高度 + 间隔 8px */
const limitedDynamics = computed(() => {
    const h = window.innerHeight
    const available = h - 200   // 顶部+统计+tab 占用
    const perItem = 48 + 10      // item + margin
    const max = Math.floor(available / perItem)
    return dynamics.value.slice(0, max)
})

/* 排行（示例数据） */
const rank = ref([
    { name: '张三', value: 120 },
    { name: '李四', value: 110 },
    { name: '王五', value: 95 }
])

/* 模拟接口获取（可直接替换 fetch） */
async function fetchDynamic() {
    const data = [
        { id: 1, name: '张三', time: '14:32', avatar: '/avatar1.png', action: 'checkin' },
        { id: 2, name: '李四', time: '14:26', avatar: '/avatar2.png', action: 'checkout' },
        { id: 3, name: '王五', time: '14:15', avatar: '/avatar3.png', action: 'checkin' }
    ]

    // 检查是否是新记录
    data.forEach(record => {
        const exists = dynamics.value.some(i => i.id === record.id)
        if (!exists) {
            record.isNew = true
        }
    })

    dynamics.value = data
}

onMounted(() => {
    fetchDynamic()
    setInterval(fetchDynamic, 8000)
})
</script>

<style scoped>
/* 整体背景：深灰渐变 */
.dashboard {
    width: 100%;
    height: 100vh;
    background: linear-gradient(180deg, #1a1a1f, #111115);
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 12px;
    box-sizing: border-box;
}

/* 时间 */
.time {
    font-size: 22px;
    font-weight: 500;
    color: #eaeaea;
    text-align: center;
    margin-bottom: 10px;
}

/* 统计区 */
.stats {
    width: 100%;
    margin-bottom: 10px;
}

.stat-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 6px;
}

.stat-row.compact {
    justify-content: space-around;
}

.stat-card {
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    font-size: 14px;
    backdrop-filter: blur(4px);
}

/* Tab */
.tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    gap: 20px;
}

.tab {
    padding: 6px 18px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    font-size: 15px;
    transition: 0.25s;
}

.tab.active {
    background: rgba(255, 255, 255, 0.18);
    font-weight: 600;
}

/* 内容区 */
.content-area {
    flex: 1;
    overflow: hidden;
}

/* 动态页 */
.dynamic-list {
    display: flex;
    flex-direction: column;
}

/* 动态条目 */
.dynamic-item {
    height: 48px;
    margin: 6px 0;
    padding: 0 12px;
    background: #1f1f26;
    border-radius: 10px;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.06);
    animation: fadeIn 0.3s ease-out;
}

/* 新记录亮条 */
.dynamic-item.is-new .left-bar {
    animation: glow 2s ease-out forwards;
}

.left-bar {
    width: 4px;
    height: 60%;
    border-radius: 3px;
    margin-right: 10px;
}

.left-bar.checkin {
    background: #00e676;
}

.left-bar.checkout {
    background: #ffca28;
}

/* 头像 */
.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
}

/* 信息区 */
.info {
    flex: 1;
}

.name {
    font-size: 15px;
    font-weight: 500;
}

.time-small {
    font-size: 12px;
    opacity: 0.65;
}

/* 动作区 */
.action {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
}

.icon-checkin {
    color: #00e676;
}

.icon-checkout {
    color: #ffca28;
}

.label {
    opacity: 0.9;
}

/* 排行页 */
.rank-page {
    padding: 10px;
}

.rank-item {
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    font-size: 16px;
}

/* 动画 */
@keyframes glow {
    0% {
        background: rgba(0, 230, 118, 0.8);
    }

    100% {
        background: rgba(0, 230, 118, 0.1);
    }
}

.slide-fade-enter-active {
    transition: all 0.35s ease-out;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
