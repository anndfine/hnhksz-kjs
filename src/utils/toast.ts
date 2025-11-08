// src/utils/toast.ts
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
    duration?: number
    position?: 'top' | 'bottom'
}

let toastContainer: HTMLDivElement | null = null

function getToastContainer(): HTMLDivElement {
    if (!toastContainer) {
        toastContainer = document.createElement('div')
        toastContainer.id = 'toast-container'
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
        `
        document.body.appendChild(toastContainer)
    }
    return toastContainer
}

// 移除Toast的函数
export function removeToast(toastId: string) {
    const toast = document.getElementById(toastId)
    if (toast) {
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast)
            }
        }, 300)
    }
}

export function showToast(type: ToastType, message: string, duration: number = 3000) {
    const container = getToastContainer()
    const toast = document.createElement('div')
    const toastId = 'toast-' + Date.now()

    toast.id = toastId
    toast.className = `alert alert-${getBootstrapClass(type)} alert-dismissible`
    toast.style.cssText = `
        margin-bottom: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `

    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getIconClass(type)} me-2 fs-5"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `

    // 添加关闭按钮事件监听
    const closeButton = toast.querySelector('.btn-close')
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            removeToast(toastId)
        })
    }

    container.appendChild(toast)

    // 滑入动画
    setTimeout(() => {
        toast.style.opacity = '1'
        toast.style.transform = 'translateX(0)'
    }, 10)

    // 自动消失
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toastId)
        }, duration)
    }

    return toastId
}

function getBootstrapClass(type: ToastType): string {
    const classes = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    }
    return classes[type]
}

function getIconClass(type: ToastType): string {
    const icons = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-exclamation-triangle-fill',
        'warning': 'bi-exclamation-circle-fill',
        'info': 'bi-info-circle-fill'
    }
    return icons[type]
}

// 批量显示Toast的函数
export function showMultipleToasts(messages: Array<{ type: ToastType, message: string, duration?: number }>) {
    messages.forEach((msg, index) => {
        setTimeout(() => {
            showToast(msg.type, msg.message, msg.duration || 3000)
        }, index * 300) // 错开显示时间
    })
}

// 清除所有Toast
export function clearAllToasts() {
    const container = getToastContainer()
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}

// 显示带进度的Toast（用于长时间操作）
export function showProgressToast(message: string, progress: number) {
    const toastId = 'progress-toast-' + Date.now()
    const container = getToastContainer()
    const toast = document.createElement('div')

    toast.id = toastId
    toast.className = 'alert alert-info alert-dismissible'
    toast.style.cssText = `
        margin-bottom: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `

    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-hourglass-split me-2 fs-5"></i>
            <div class="flex-grow-1">
                <div class="mb-1">${message}</div>
                <div class="progress" style="height: 4px;">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
            </div>
            <button type="button" class="btn-close"></button>
        </div>
    `

    // 添加关闭按钮事件
    const closeButton = toast.querySelector('.btn-close')
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            removeToast(toastId)
        })
    }

    container.appendChild(toast)

    // 滑入动画
    setTimeout(() => {
        toast.style.opacity = '1'
        toast.style.transform = 'translateX(0)'
    }, 10)

    return {
        updateProgress: (newProgress: number) => {
            const progressBar = toast.querySelector('.progress-bar') as HTMLElement
            if (progressBar) {
                progressBar.style.width = `${newProgress}%`
            }
        },
        updateMessage: (newMessage: string) => {
            const messageElement = toast.querySelector('.mb-1') as HTMLElement
            if (messageElement) {
                messageElement.textContent = newMessage
            }
        },
        close: () => removeToast(toastId)
    }
}