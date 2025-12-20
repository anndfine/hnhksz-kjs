<template>
    <div class="live-layout">
        <!-- 顶部导航栏 -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" @click.prevent="router.push('/')">
                    <i class="bi bi-cpu-fill me-2"></i>海口四中展翼科技社
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#liveNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="liveNavbar">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('nav')">导航页</a></li>
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('live')">直播</a></li>
                        <li class="nav-item"><a class="nav-link" @click.prevent="tagChange('video')">视频</a></li>
                        <li class="nav-item"><a class="nav-link" @click.prevent="router.push('/help')">使用指南</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- 主要内容区域 -->
        <main class="container-fluid py-4">
            <!-- 导航模块 -->
            <LiveNav v-if="activeTab === 'nav'" @tag-change="tagChange" @navigate="router.push" />
            <!-- 直播列表 -->
            <LiveList v-if="activeTab === 'live' && !isLivePage" :liveList="liveList" :loading="loading" :error="error"
                :currentLive="currentLive" @select-live="showLivePage" @refresh="fetchLiveList" @tag-change="tagChange"
                @navigate="router.push" />

            <!-- 直播间 / 播放器 -->
            <LivePlayer v-if="activeTab === 'live' && isLivePage && currentLive" :currentLive="currentLive"
                @close="closeLivePage" />

            <!-- 视频列表 -->
            <VideoList v-if="activeTab === 'video'" />
        </main>

        <!-- 页脚 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
declare global {
    interface Window {
        DPlayer: any,
        Hls: any,
        flvjs: any
    }
}
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/components/member/useAuth.ts'
import Footer from '@/components/Layout/Footer.vue'

// 导入拆分后的组件
import LiveNav from './LiveNav.vue'
import LiveList from './LiveList.vue'
import LivePlayer from './LivePlayer.vue'
import VideoList from './VideoList.vue'

const router = useRouter()
const { isAuthenticated, user, checkAuth } = useAuth()

// 直播流接口定义
export interface LiveStream {
    id: string
    title?: string
    description?: string
    url?: string
    thumbnail?: string
    status?: 'live' | 'offline' | 'upcoming'
    viewers?: number
    updatedAt?: string
}

// 状态管理
const liveList = ref<LiveStream[]>([])
const currentLive = ref<LiveStream | null>(null)
const isLivePage = ref(false)
const loading = ref(true)
const error = ref('')
const activeTab = ref('nav')

// 标签切换方法
const tagChange = (tab: string) => {
    activeTab.value = tab
    window.location.hash = `#/${tab}`
    if (tab === 'live') {
        isLivePage.value = false
    }
}

// 显示直播间
const showLivePage = (live: LiveStream) => {
    currentLive.value = live
    isLivePage.value = true
    activeTab.value = 'live'
    window.location.hash = `#/live/${live.id}`   // ✅ 保证前面有 /
}

// 关闭直播间
const closeLivePage = () => {
    isLivePage.value = false
}

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
                // thumbnail: '/images/live-thumb-1.jpg',
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

// 处理hash变化事件
const handleHashChange = () => {
    // 去掉 #/
    const hash = window.location.hash.slice(2) || 'nav'

    if (hash.startsWith('live')) {
        activeTab.value = 'live'

        const parts = hash.split('/')
        const id = parts[1] // 可能 undefined 或空字符串

        if (id) {
            // 有 id → 进入直播间
            isLivePage.value = true
            currentLive.value = { id } // 只存 id，具体数据由 LivePlayer fetch
        } else {
            // 没有 id → 只显示直播列表
            isLivePage.value = false
            currentLive.value = null
        }
    } else {
        // 普通 tab
        activeTab.value = hash
        isLivePage.value = false
        currentLive.value = null
    }
}

const loadVideoDependencies = async () => {
    // DPlayer
    if (!window.DPlayer) {
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/dplayer@1.27.1/dist/DPlayer.min.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('DPlayer加载失败'))
            document.head.appendChild(script)
        })
    }

    // Hls.js
    if (!window.Hls) {
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.3.5/dist/hls.min.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Hls.js加载失败'))
            document.head.appendChild(script)
        })
    }

    // flv.js
    if (!window.flvjs) {
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('flv.js加载失败'))
            document.head.appendChild(script)
        })
    }
}



// 初始化
onMounted(async () => {
    await checkAuth()
    await loadVideoDependencies().catch(err => console.error(err))
    fetchLiveList()
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    // 组件卸载时移除事件监听器
    return () => {
        window.removeEventListener('hashchange', handleHashChange)
    }
})
</script>

<style scoped>
.live-layout {
    background-color: #1a1a1a;
    min-height: 100vh;
}

.navbar-brand {
    font-weight: 600;
    cursor: pointer;
}

main {
    background-color: #1a1a1a;
}
</style>