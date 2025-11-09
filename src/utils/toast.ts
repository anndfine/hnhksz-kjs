// src/utils/toast.ts
import { createApp, type App } from 'vue'
import ToastComponent from '@/components/common/Toast.vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

let toastApp: App<Element> | null = null
let toastInstance: any = null

// 初始化Toast
export const initToast = () => {
    if (!toastApp) {
        const toastContainer = document.createElement('div')
        toastContainer.id = 'toast-global-container'
        document.body.appendChild(toastContainer)

        toastApp = createApp(ToastComponent)
        toastInstance = toastApp.mount(toastContainer)
    }
}

// 显示Toast
export const showToast = (type: ToastType, message: string, duration: number = 5000): number => {
    if (!toastInstance) {
        initToast()
    }

    return toastInstance.addToast(type, message, duration)
}

// 移除特定Toast
export const removeToast = (id: number) => {
    if (toastInstance) {
        toastInstance.removeToast(id)
    }
}

// 清空所有Toast
export const clearToasts = () => {
    if (toastInstance) {
        toastInstance.clearToasts()
    }
}

// 快捷方法
export const toast = {
    success: (message: string, duration?: number) => showToast('success', message, duration),
    error: (message: string, duration?: number) => showToast('error', message, duration),
    warning: (message: string, duration?: number) => showToast('warning', message, duration),
    info: (message: string, duration?: number) => showToast('info', message, duration),
    remove: removeToast,
    clear: clearToasts,
    initToast: initToast
}

export default toast