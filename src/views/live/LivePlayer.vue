<template>
    <div class="live-player-container container">
        <!-- 返回列表小按钮 -->
        <div class="row mb-3">
            <div class="col-12">
                <button class="btn btn-outline-light btn-sm" @click="goBack">
                    <i class="bi bi-arrow-left me-1"></i> 返回列表
                </button>
            </div>
        </div>

        <!-- 播放器 + 右侧信息 -->
        <div class="row justify-content-center">
            <!-- 播放器列 -->
            <div class="col-12 col-md-8 mb-3">
                <div ref="playerRef" class="dplayer-container"></div>
            </div>

            <!-- PC端右侧信息列 -->
            <div class="col-12 col-md-4 d-none d-md-block">
                <div class="live-info p-3 rounded bg-dark text-white">
                    <h3>{{ liveData?.title }}</h3>
                    <p>主播：{{ liveData?.author || '未知' }}</p>
                    <p>观众：{{ liveData?.viewers ?? 0 }}</p>
                </div>
            </div>
        </div>

        <!-- 移动端信息 -->
        <div class="live-info-mobile d-block d-md-none text-white p-2 rounded bg-dark mt-3 text-center">
            <h3>{{ liveData?.title }}</h3>
            <p>主播：{{ liveData?.author || '未知' }} | 观众：{{ liveData?.viewers ?? 0 }}</p>
        </div>
    </div>
</template>

<style scoped>
.dplayer-container {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
}

.live-info h3,
.live-info-mobile h3 {
    font-size: 1.25rem;
}

.live-info p,
.live-info-mobile p {
    margin-bottom: 0.5rem;
}

/* 可选：让小按钮在 PC/Mobile 位置稍微贴边 */
.btn-sm {
    display: inline-flex;
    align-items: center;
}
</style>


<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{ currentLive: { id: string } }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const playerRef = ref<HTMLElement | null>(null)
let player: any = null
const liveData = ref<any>(null)

const fetchLiveData = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
        success: true,
        title: '科技社日常直播',
        author: '张三',
        viewers: 123,
        video: {
            quality: [
                { name: 'HD', url: 'https://vid-sto-pat-eedap-region3.yt437700.top/ts/hls/stream_1/playlist.m3u8', type: 'hls' },
                { name: 'SD', url: 'https://vid-sto-pat-eedap-region3.yt437700.top/ts/hls/stream_1/playlist.m3u8', type: 'hls' }
            ],
            defaultQuality: 0,
            // pic: 'demo.png',
            // thumbnails: 'thumbnails.jpg'
        }
    }
}

const initPlayer = async () => {
    if (!playerRef.value || !liveData.value?.video) return
    if (!window.DPlayer) return console.warn('DPlayer 未加载')

    if (player?.destroy) player.destroy()

    const video = liveData.value.video
    const defaultQuality = video.quality[video.defaultQuality]

    const options: any = {
        container: playerRef.value,
        live: true,
        autoplay: true,
        theme: '#007bff',
        video: {
            url: defaultQuality.url,
            pic: video.pic,
            type: defaultQuality.type
        }
    }

    // HLS 支持
    if (defaultQuality.type === 'hls') {
        options.video.customType = {
            hls: (videoElement: HTMLVideoElement) => {
                if (!window.Hls) return console.warn('Hls.js 未加载')
                const hls = new window.Hls()
                hls.loadSource(defaultQuality.url)
                hls.attachMedia(videoElement)
            }
        }
    }

    player = new window.DPlayer(options)
}

onMounted(async () => {
    liveData.value = await fetchLiveData(props.currentLive.id)
    await nextTick()
    initPlayer()
})

watch(() => props.currentLive.id, async newId => {
    liveData.value = await fetchLiveData(newId)
    await nextTick()
    initPlayer()
})
const goBack = () => {
    // 改变 hash 到直播列表页
    window.location.hash = '#/live'
    // 同时触发 close 事件
    emit('close')
}

</script>
