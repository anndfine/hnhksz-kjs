<template>
    <div class="home">
        <!-- 顶部导航栏 -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" @click.prevent="router.push('/')">
                    <i class="bi bi-cpu-fill me-2"></i>海口四中展翼科技社
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#homeNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="homeNavbar">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('nav')">导航页</a></li>
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('live')">直播</a></li>
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('video')">视频</a></li>
                        <!-- <li class="nav-item"><a class="nav-link" @click.prevent="router.push('/member')">成员系统</a></li> -->
                        <li class="nav-item"><a class="nav-link" @click.prevent="router.push('/help')">使用指南</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <main class="container-fluid py-4">
            <div class="row g-4">
                <!-- 左侧功能卡片 + 直播列表 -->
                <div class="col-lg-8" v-if="activeTab !== 'live' || !isLivePage">
                    <div class="row g-3">
                        <!-- 功能卡片 -->
                        <div class="col-md-6" @click="tagChange('live')">
                            <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div class="card-body text-center p-4">
                                    <i class="bi bi-broadcast display-4 text-primary mb-3"></i>
                                    <h6 class="card-title">查看直播</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6" @click="tagChange('video')">
                            <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div class="card-body text-center p-4">
                                    <i class="bi bi-play-btn display-4 text-success mb-3"></i>
                                    <h6 class="card-title">视频回放</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6" @click="router.push('/member')">
                            <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div class="card-body text-center p-4">
                                    <i class="bi bi-people display-4 text-info mb-3"></i>
                                    <h6 class="card-title">成员系统</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6" @click="router.push('/help')">
                            <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div class="card-body text-center p-4">
                                    <i class="bi bi-book display-4 text-warning mb-3"></i>
                                    <h6 class="card-title">使用指南</h6>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <!-- 右侧用户信息栏 -->
                <div class="col-lg-4" v-if="activeTab !== 'live' || !isLivePage">
                    <div class="card shadow-sm">
                        <div class="card-header bg-dark text-white">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-person-circle me-2"></i>用户信息
                            </h5>
                        </div>
                        <div class="card-body text-center p-0">
                            <div v-if="!isAuthenticated" class="py-4 px-3">
                                <i class="bi bi-person-x display-4 text-muted mb-3"></i>
                                <h6 class="text-muted">未登录</h6>
                                <p class="small text-muted mb-3">请登录以查看个人信息</p>
                                <a href="/member" class="btn btn-primary">登录</a>
                            </div>
                            <div v-else class="p-3">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="flex-shrink-0">
                                        <img v-if="user?.avatar" :src="user.avatar" class="avatar rounded-circle border"
                                            alt="用户头像" style="width: 60px; height: 60px; object-fit: cover;">
                                        <div v-else
                                            class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                                            style="width: 60px; height: 60px;">
                                            <i class="bi bi-person-fill fs-4"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1 ms-3 text-start">
                                        <h6 class="mb-1 fw-bold">{{ user?.name || '用户' }}</h6>
                                        <span class="badge bg-secondary">{{ user?.role || '成员' }}</span>
                                        <div class="small text-muted mt-1">
                                            <i class="bi bi-clock me-1"></i>{{ formatLastLogin(user?.lastLogin) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 直播列表 -->
            <div class="live-list-section mt-4"
                v-if="activeTab === 'live' && !loading && !error && liveList.length > 0">
                <h3><i class="bi bi-list-ul me-2"></i>直播列表</h3>
                <div class="live-list row g-3">
                    <div v-for="live in liveList" :key="live.id" class="col-md-6 col-lg-4" @click="showLivePage(live)"
                        style="cursor: pointer;">
                        <div class="card h-100 border-0 shadow-sm hover-card bg-dark text-white"
                            :class="{ 'border-primary': currentLive?.id === live.id }">
                            <img :src="live.thumbnail" class="card-img-top" :alt="live.title">
                            <div class="card-body">
                                <h5 class="card-title">{{ live.title }}</h5>
                                <p class="card-text">{{ live.description }}</p>
                                <div class="d-flex justify-content-between small text-muted">
                                    <span><i class="bi bi-eye"></i> {{ live.viewers || 0 }}</span>
                                    <span>{{ formatTime(live.updatedAt) }}</span>
                                </div>
                                <span class="badge mt-2" :class="{
                                    'bg-success': live.status === 'live',
                                    'bg-warning': live.status === 'upcoming',
                                    'bg-secondary': live.status === 'offline'
                                }">
                                    {{ getStatusText(live.status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 视频列表（占位） -->
            <div class="video-list-section mt-4" v-if="activeTab === 'video'">
                <h3><i class="bi bi-film me-2"></i>视频回放</h3>
                <div class="text-center text-muted py-5">
                    <i class="bi bi-film display-4 mb-3"></i>
                    <p>视频回放功能正在开发中...</p>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="text-center my-3">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">正在获取直播列表...</p>
            </div>

            <!-- 错误状态 -->
            <div v-if="error" class="alert alert-warning mt-3 text-center">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                <button class="btn btn-sm btn-primary ms-2" @click="fetchLiveList">
                    <i class="bi bi-arrow-clockwise me-1"></i>重试
                </button>
            </div>
        </main>

        <!-- 直播间 / 播放器区域 -->
        <div v-if="activeTab === 'live' && isLivePage && currentLive" class="live-player-container mt-4">
            <div ref="playerRef" class="dplayer-container"></div>
            <div class="text-center mt-3">
                <button class="btn btn-sm btn-outline-primary" @click="closeLivePage">
                    <i class="bi bi-arrow-left me-1"></i>返回直播列表
                </button>
            </div>
        </div>

        <!-- 页脚 -->
        <Footer />

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/components/member/useAuth.ts'
import Footer from '@/components/Layout/Footer.vue'

const router = useRouter()
const { isAuthenticated, user, checkAuth } = useAuth()

interface LiveStream {
    id: string
    title: string
    description: string
    url: string
    thumbnail: string
    status: 'live' | 'offline' | 'upcoming'
    viewers: number
    updatedAt: string
}

const liveList = ref<LiveStream[]>([])
const currentLive = ref<LiveStream | null>(null)
const isLivePage = ref(false) // 控制直播间显示
const loading = ref(true)
const error = ref('')
const activeTab = ref('home') // 当前活动标签: 'home', 'live', 'video'

const playerRef = ref<HTMLElement | null>(null)
let player: any = null

// 标签切换方法
const tagChange = (tab: string) => {
    activeTab.value = tab
    window.location.hash = tab
    // 如果切换到直播标签，显示直播列表
    if (tab === 'live') {
        isLivePage.value = false
    }
}

// 显示直播间并选中直播
const showLivePage = (liveOrEvent?: LiveStream | null | Event) => {
    let live: LiveStream | null = null

    if (liveOrEvent instanceof Event) {
        live = liveList.value[0] || null
    } else if (liveOrEvent) {
        live = liveOrEvent
    } else {
        live = liveList.value[0] || null
    }

    if (!live) return // 没有直播直接返回

    currentLive.value = live
    isLivePage.value = true
    activeTab.value = 'live'
    window.location.hash = 'live'
    nextTick(() => initializePlayer())
}

// 关闭直播间返回列表
const closeLivePage = () => {
    isLivePage.value = false
    if (player?.destroy) {
        player.destroy()
        player = null
    }
}

// 选择列表直播
const selectLive = (live: LiveStream) => showLivePage(live)

// 获取直播列表（模拟）
const fetchLiveList = async () => {
    try {
        loading.value = true
        error.value = ''
        await new Promise(resolve => setTimeout(resolve, 500))
        liveList.value = [
            {
                id: '0',
                title: '网络连通性测试',
                description: '管理员开放的测试流',
                url: 'https://vid-sto-pat-eedap-region3.yt437700.top/ts/hls/stream_1/playlist.m3u8',
                thumbnail: '/images/live-thumb-1.jpg',
                status: 'live',
                viewers: 156,
                updatedAt: new Date().toISOString()
            }
        ]
    } catch (err) {
        error.value = '获取直播列表失败'
    } finally {
        loading.value = false
    }
}

// DPlayer初始化示例
const initializePlayer = async () => {
    if (!currentLive.value || !playerRef.value) return
    if (player?.destroy) player.destroy()
    const DPlayer = (window as any).DPlayer
    if (!DPlayer) return console.warn('DPlayer未加载')
    player = new DPlayer({
        container: playerRef.value,
        live: true,
        autoplay: true,
        theme: '#007bff',
        video: { url: currentLive.value.url, type: 'hls' }
    })
}

// 辅助函数
const getStatusText = (status: string) => {
    switch (status) {
        case 'live': return '直播中'
        case 'upcoming': return '即将开始'
        default: return '已结束'
    }
}
const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
const formatLastLogin = (lastLogin?: string) => lastLogin ? new Date(lastLogin).toLocaleString('zh-CN') : '首次登录'

// 处理hash变化事件
const handleHashChange = () => {
    const hash = window.location.hash.slice(1) || 'home'
    tagChange(hash)
}

onMounted(async () => {
    await checkAuth()
    fetchLiveList()

    // 初始化时检查hash
    handleHashChange()

    // 添加hash变化事件监听器
    window.addEventListener('hashchange', handleHashChange)
})

// 组件卸载时移除事件监听器
onMounted(() => {
    return () => {
        window.removeEventListener('hashchange', handleHashChange)
    }
})
</script>

<style scoped>
.home {
    background-color: #1a1a1a;
    min-height: 100vh;
}

.hover-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1) !important;
}

.navbar-brand {
    font-weight: 600;
    cursor: pointer;
}

.card {
    border-radius: 12px;
    border: 1px solid #333;
}

.card-header {
    border-radius: 12px 12px 0 0 !important;
}

.btn {
    border-radius: 6px;
}

main {
    background-color: #1a1a1a;
}

.live-player-container {
    max-width: 100%;
    height: 480px;
    margin: 0 auto;
}
</style>