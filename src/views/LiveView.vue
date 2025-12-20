<template>
    <div class="live-view">
        <Navbar />
        <div class="live-container">
            <!-- 页面标题 -->
            <div class="live-header">
                <h1><i class="bi bi-broadcast me-2"></i>科技社直播</h1>
                <p class="live-subtitle">实时观看科技社活动直播</p>
            </div>

            <!-- 主要内容区域 -->
            <div class="live-content">
                <!-- 直播播放器区域 -->
                <div class="player-section" v-if="currentLive">
                    <div class="player-wrapper">
                        <div ref="playerRef" class="dplayer-container"></div>
                    </div>
                    <div class="live-info">
                        <h3 class="live-title">{{ currentLive.title }}</h3>
                        <div class="live-meta">
                            <span class="live-status" :class="currentLive.status">
                                <i class="bi" :class="getStatusIcon(currentLive.status)"></i>
                                {{ getStatusText(currentLive.status) }}
                            </span>
                            <span class="live-viewers">
                                <i class="bi bi-eye"></i>
                                {{ currentLive.viewers || 0 }} 人观看
                            </span>
                            <span class="live-updated">
                                最后更新: {{ formatTime(currentLive.updatedAt) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 直播列表 -->
                <div class="live-list-section">
                    <h3><i class="bi bi-list-ul me-2"></i>直播列表</h3>
                    <div class="live-list">
                        <div v-for="live in liveList" :key="live.id" class="live-item"
                            :class="{ active: currentLive?.id === live.id }" @click="selectLive(live)">
                            <div class="live-thumbnail">
                                <img :src="live.thumbnail" :alt="live.title" />
                                <div class="live-status-badge" :class="live.status">
                                    {{ getStatusText(live.status) }}
                                </div>
                            </div>
                            <div class="live-details">
                                <h4 class="live-item-title">{{ live.title }}</h4>
                                <p class="live-item-desc">{{ live.description }}</p>
                                <div class="live-item-meta">
                                    <span class="live-item-viewers">
                                        <i class="bi bi-eye"></i>
                                        {{ live.viewers || 0 }}
                                    </span>
                                    <span class="live-item-updated">
                                        {{ formatTime(live.updatedAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 加载状态 -->
                    <div v-if="loading" class="loading-section">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">加载中...</span>
                        </div>
                        <p>正在获取直播列表...</p>
                    </div>

                    <!-- 错误状态 -->
                    <div v-if="error" class="error-section">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ error }}
                        </div>
                        <button class="btn btn-primary" @click="fetchLiveList">
                            <i class="bi bi-arrow-clockwise me-2"></i>
                            重新加载
                        </button>
                    </div>

                    <!-- 空状态 -->
                    <div v-if="!loading && !error && liveList.length === 0" class="empty-section">
                        <i class="bi bi-broadcast empty-icon"></i>
                        <p>暂无直播内容</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import Navbar from "@/components/Layout/Navbar.vue"
import Footer from '@/components/Layout/Footer.vue'

// 声明全局类型
declare global {
    interface Window {
        DPlayer: any
        Hls: any
        flvjs: any
    }
}

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

// 响应式数据
const loading = ref(true)
const error = ref('')
const liveList = ref<LiveStream[]>([])
const currentLive = ref<LiveStream | null>(null)
const playerRef = ref<HTMLElement | null>(null)
let player: any = null

// 按顺序加载依赖
const loadDependencies = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            // 加载HLS.js
            if (!window.Hls) {
                await new Promise<void>((resolveHls, rejectHls) => {
                    const hlsScript = document.createElement('script')
                    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest'
                    hlsScript.onload = () => {
                        console.log('HLS.js loaded successfully')
                        resolveHls()
                    }
                    hlsScript.onerror = () => rejectHls(new Error('Failed to load HLS.js'))
                    document.head.appendChild(hlsScript)
                })
            }

            // 加载FLV.js
            if (!window.flvjs) {
                await new Promise<void>((resolveFlv, rejectFlv) => {
                    const flvScript = document.createElement('script')
                    flvScript.src = 'https://cdn.jsdelivr.net/npm/flv.js@latest'
                    flvScript.onload = () => {
                        console.log('FLV.js loaded successfully')
                        resolveFlv()
                    }
                    flvScript.onerror = () => rejectFlv(new Error('Failed to load FLV.js'))
                    document.head.appendChild(flvScript)
                })
            }

            // 加载DPlayer CSS
            if (!document.querySelector('link[href*="DPlayer.min.css"]')) {
                const cssLink = document.createElement('link')
                cssLink.rel = 'stylesheet'
                cssLink.href = 'https://cdn.jsdelivr.net/npm/dplayer@1.27.1/dist/DPlayer.min.css'
                document.head.appendChild(cssLink)
            }

            // 加载DPlayer
            if (!window.DPlayer) {
                await new Promise<void>((resolveDPlayer, rejectDPlayer) => {
                    const script = document.createElement('script')
                    script.src = 'https://cdn.jsdelivr.net/npm/dplayer@1.27.1/dist/DPlayer.min.js'
                    script.onload = () => {
                        console.log('DPlayer loaded successfully')
                        resolveDPlayer()
                    }
                    script.onerror = () => rejectDPlayer(new Error('Failed to load DPlayer'))
                    document.head.appendChild(script)
                })
            }

            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

// 获取直播列表
const fetchLiveList = async () => {
    try {
        loading.value = true
        error.value = ''

        // TODO: 替换为实际的API接口
        // const response = await fetch('/api/live/streams')
        // const data = await response.json()

        // 模拟API数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockData: LiveStream[] = [
            {
                id: '0',
                title: '网络连通性测试',
                description: '管理员开放的测试流',
                url: 'https://vid-sto-pat-eedap-region3.yt437700.top/ts/hls/stream_1/playlist.m3u8',
                thumbnail: '/images/live-thumb-1.jpg',
                status: 'live',
                viewers: 156,
                updatedAt: new Date().toISOString()
            },
            // {
            //     id: '1',
            //     title: '科技社日常活动直播',
            //     description: '展示科技社成员的日常学习和项目开发活动',
            //     url: 'https://example.com/live/stream1.m3u8',
            //     thumbnail: '/images/live-thumb-1.jpg',
            //     status: 'live',
            //     viewers: 156,
            //     updatedAt: new Date().toISOString()
            // },
            // {
            //     id: '2',
            //     title: '项目展示直播',
            //     description: '各项目组展示最新开发成果',
            //     url: 'https://example.com/live/stream2.m3u8',
            //     thumbnail: '/images/live-thumb-2.jpg',
            //     status: 'upcoming',
            //     viewers: 0,
            //     updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            // },
            // {
            //     id: '3',
            //     title: '技术分享会直播',
            //     description: '技术大咖分享最新技术趋势',
            //     url: 'https://example.com/live/stream3.m3u8',
            //     thumbnail: '/images/live-thumb-3.jpg',
            //     status: 'offline',
            //     viewers: 89,
            //     updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            // }
        ]

        liveList.value = mockData
        if (mockData.length > 0 && !currentLive.value) {
            currentLive.value = mockData[0]!
        }
    } catch (err) {
        error.value = '获取直播列表失败，请稍后重试'
        console.error('获取直播列表失败:', err)
    } finally {
        loading.value = false
    }
}

// 选择直播
const selectLive = (live: LiveStream) => {
    currentLive.value = live
}

// 监听currentLive变化，初始化播放器
watch(currentLive, (newLive, oldLive) => {
    if (newLive?.id !== oldLive?.id) {
        if (newLive?.status === 'live') {
            // 延迟初始化，确保DOM更新完成
            setTimeout(() => {
                initializePlayer()
            }, 100)
        } else {
            destroyPlayer()
        }
    }
})

// 检查HLS支持
const checkHlsSupport = () => {
    if (window.Hls) {
        return window.Hls.isSupported()
    }
    return false
}

// 初始化播放器
const initializePlayer = async () => {
    if (!currentLive.value || currentLive.value.status !== 'live') {
        console.warn('当前直播不可播放或未选择直播')
        return
    }

    try {
        // 确保依赖已加载
        await loadDependencies()

        // 等待DOM更新，确保容器元素存在
        await nextTick()

        // 确保ref指向的元素存在
        if (!playerRef.value) {
            console.error('播放器容器元素未找到')
            // 创建容器如果不存在
            const container = document.createElement('div')
            container.className = 'dplayer-container'
            document.querySelector('.player-wrapper')?.appendChild(container)
            playerRef.value = container
        }

        // 清理可能存在的旧播放器
        destroyPlayer()

        console.log('开始初始化播放器...')

        // 检查HLS支持并确定视频类型
        let videoType = 'auto'
        const videoUrl = currentLive.value.url

        // 根据URL后缀判断类型
        if (videoUrl.includes('.m3u8')) {
            if (checkHlsSupport()) {
                videoType = 'hls'
                console.log('使用HLS模式播放')
            } else {
                console.warn('HLS不支持，尝试其他格式')
            }
        }

        // 创建播放器配置
        const playerConfig: any = {
            container: playerRef.value,
            live: true,
            autoplay: true,
            theme: '#007bff',
            video: {
                url: videoUrl,
                type: "hls"
            }
        }

        // 检查浏览器是否原生支持HLS
        // const videoElement = document.createElement('video')
        // if (videoUrl.includes('.m3u8') &&
        //     (videoElement.canPlayType('application/x-mpegURL') ||
        //         videoElement.canPlayType('application/vnd.apple.mpegURL'))) {
        //     console.log('浏览器原生支持HLS，使用normal模式')
        //     playerConfig.video.type = 'normal'
        // }

        console.log('播放器配置:', playerConfig)

        // 创建播放器实例
        player = new window.DPlayer(playerConfig)

        // 添加事件监听
        player.on('error', (e: any) => {
            console.error('播放器错误详情:', e)

            // 尝试其他格式
            // if (playerConfig.video.type === 'hls' || playerConfig.video.type === 'auto') {
            //     console.log('尝试使用normal模式...')
            //     // playerConfig.video.type = 'normal'
            //     destroyPlayer()
            //     setTimeout(() => {
            //         player = new window.DPlayer(playerConfig)
            //     }, 500)
            // }
        })

        player.on('loadedmetadata', () => {
            console.log('视频元数据加载完成')
        })

        player.on('canplay', () => {
            console.log('视频可以播放了')
        })

        player.on('play', () => {
            console.log('开始播放')
        })

        player.on('pause', () => {
            console.log('暂停播放')
        })

        console.log('播放器初始化完成')

    } catch (err) {
        console.error('初始化播放器失败:', err)

        // 显示用户友好的错误信息
        error.value = '播放器初始化失败，请刷新页面重试'

        // 尝试使用备用方法
        setTimeout(() => {
            if (currentLive.value?.status === 'live') {
                console.log('尝试备用方法初始化播放器...')
                initializePlayerFallback()
            }
        }, 2000)
    }
}

// 备用播放器初始化方法
const initializePlayerFallback = () => {
    if (!playerRef.value || !currentLive.value) return

    try {
        // 清理可能存在的旧播放器
        destroyPlayer()

        // 直接创建video元素
        const videoElement = document.createElement('video')
        videoElement.style.width = '100%'
        videoElement.style.height = '100%'
        videoElement.style.objectFit = 'contain'
        videoElement.controls = true
        videoElement.autoplay = true

        // 设置视频源
        const sourceElement = document.createElement('source')
        sourceElement.src = currentLive.value.url
        sourceElement.type = 'application/x-mpegURL'

        videoElement.appendChild(sourceElement)
        playerRef.value.appendChild(videoElement)

        // 存储video元素引用以便销毁
        player = videoElement

        console.log('使用备用video元素播放')
    } catch (err) {
        console.error('备用播放器初始化失败:', err)
    }
}

// 销毁播放器
const destroyPlayer = () => {
    if (player) {
        try {
            // 检查是否是DPlayer实例
            if (player.destroy && typeof player.destroy === 'function') {
                player.destroy()
                console.log('DPlayer实例已销毁')
            } else if (player.parentNode) {
                // 如果是video元素，直接移除
                player.parentNode.removeChild(player)
                console.log('Video元素已移除')
            }
        } catch (err) {
            console.error('销毁播放器时出错:', err)
        }
        player = null
    }

    // 清理容器
    if (playerRef.value) {
        playerRef.value.innerHTML = ''
    }
}

// 状态相关方法
const getStatusIcon = (status: string) => {
    switch (status) {
        case 'live': return 'bi-broadcast'
        case 'upcoming': return 'bi-clock'
        default: return 'bi-broadcast'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'live': return '直播中'
        case 'upcoming': return '即将开始'
        default: return '已结束'
    }
}

const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 生命周期
onMounted(() => {
    // 预加载依赖
    loadDependencies().catch(err => {
        console.warn('预加载依赖失败:', err)
    })

    // 获取直播列表
    fetchLiveList()
})

onUnmounted(() => {
    destroyPlayer()
})
</script>
<style scoped>
.live-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.live-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.live-header {
    text-align: center;
    margin-bottom: 2rem;
}

.live-header h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
}

.live-subtitle {
    color: #7f8c8d;
    font-size: 1.1rem;
}

.live-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.player-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.player-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
    height: 0;
}

.player-wrapper :deep(#dplayer) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}


.dplayer-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
}

.live-info {
    padding: 1rem;
}

.live-title {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.live-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: #7f8c8d;
}

.live-status.live {
    color: #e74c3c;
    font-weight: 600;
}

.live-status.upcoming {
    color: #f39c12;
}

.live-list-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
}

.live-list-section h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.live-list {
    max-height: 600px;
    overflow-y: auto;
}

.live-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.live-item:hover {
    border-color: #007bff;
    transform: translateY(-2px);
}

.live-item.active {
    border-color: #007bff;
    background-color: #f8f9fa;
}

.live-thumbnail {
    position: relative;
    flex-shrink: 0;
    width: 120px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
}

.live-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.live-status-badge {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
}

.live-status-badge.live {
    background-color: #e74c3c;
}

.live-status-badge.upcoming {
    background-color: #f39c12;
}

.live-status-badge.offline {
    background-color: #95a5a6;
}

.live-details {
    flex: 1;
}

.live-item-title {
    color: #2c3e50;
    font-size: 1rem;
    margin-bottom: 0.25rem;
}

.live-item-desc {
    color: #7f8c8d;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.live-item-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #bdc3c7;
}

.loading-section,
.empty-section {
    text-align: center;
    padding: 3rem;
    color: #7f8c8d;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.error-section {
    text-align: center;
    padding: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .live-content {
        grid-template-columns: 1fr;
    }

    .live-container {
        padding: 1rem;
    }

    .live-header h1 {
        font-size: 2rem;
    }

    .live-item {
        flex-direction: column;
    }

    .live-thumbnail {
        width: 100%;
        height: 200px;
    }
}
</style>