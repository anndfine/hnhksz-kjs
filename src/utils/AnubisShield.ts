// src/utils/AnubisShield.ts
export interface AnubisConfig {
    challengeUrl: string
    difficulty?: number
    timeout?: number
}

export interface AnubisChallenge {
    challenge: string
    timestamp: number
    expires: number
    difficulty: number
}

export interface AnubisResult {
    success: boolean
    token?: string
    challenge?: string
    response?: string
    error?: string
}

export class AnubisShield {
    private config: Required<AnubisConfig>
    private currentChallenge: AnubisChallenge | null = null
    private modalElement: HTMLElement | null = null
    private iframeElement: HTMLIFrameElement | null = null

    constructor(config: AnubisConfig) {
        this.config = {
            difficulty: config.difficulty || 1000000,
            timeout: config.timeout || 30000,
            challengeUrl: config.challengeUrl
        }
    }

    /**
     * 初始化防护罩
     */
    async initialize(): Promise<void> {
        this.createModal()
        await this.loadChallenge()
    }

    /**
     * 创建模态框
     */
    private createModal(): void {
        // 移除已存在的模态框
        this.destroy()

        // 创建模态框容器
        this.modalElement = document.createElement('div')
        this.modalElement.id = 'anubis-shield-modal'
        this.modalElement.innerHTML = `
      <div class="anubis-modal-overlay">
        <div class="anubis-modal-content">
          <div class="anubis-modal-header">
            <h3>🔒 安全验证</h3>
            <p>请完成验证以继续登录</p>
          </div>
          <div class="anubis-modal-body">
            <div class="anubis-shield-container">
              <div class="anubis-loading">
                <div class="anubis-spinner"></div>
                <p>正在初始化安全验证...</p>
              </div>
            </div>
          </div>
          <div class="anubis-modal-footer">
            <small>此验证用于防止自动化攻击</small>
          </div>
        </div>
      </div>
    `

        document.body.appendChild(this.modalElement)
        this.applyStyles()
    }

    /**
     * 应用样式
     */
    private applyStyles(): void {
        const style = document.createElement('style')
        style.textContent = `
      #anubis-shield-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9955;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .anubis-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: anubis-fadeIn 0.3s ease;
      }

      .anubis-modal-content {
        background: white;
        border-radius: 16px;
        padding: 0;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: anubis-slideUp 0.3s ease;
        overflow: hidden;
      }

      .anubis-modal-header {
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        color: white;
        padding: 24px;
        text-align: center;
      }

      .anubis-modal-header h3 {
        margin: 0 0 8px 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .anubis-modal-header p {
        margin: 0;
        opacity: 0.9;
        font-size: 0.9rem;
      }

      .anubis-modal-body {
        padding: 32px 24px;
      }

      .anubis-modal-footer {
        padding: 16px 24px;
        background: #f8f9fa;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }

      .anubis-modal-footer small {
        color: #6c757d;
        font-size: 0.8rem;
      }

      .anubis-loading {
        text-align: center;
        color: #6c757d;
      }

      .anubis-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e9ecef;
        border-top: 3px solid #1e3c72;
        border-radius: 50%;
        animation: anubis-spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      .anubis-challenge {
        text-align: center;
      }

      .anubis-progress {
        width: 100%;
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        overflow: hidden;
        margin: 16px 0;
      }

      .anubis-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #1e3c72, #2a5298);
        border-radius: 3px;
        transition: width 0.3s ease;
        animation: anubis-pulse 2s ease-in-out infinite;
      }

      .anubis-status {
        font-size: 0.9rem;
        color: #6c757d;
        margin-top: 8px;
      }

      @keyframes anubis-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes anubis-slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes anubis-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes anubis-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `
        document.head.appendChild(style)
    }

    /**
     * 加载挑战
     */
    private async loadChallenge(): Promise<void> {
        try {
            this.updateUI('loading', '正在获取安全挑战...')

            // 模拟获取挑战 - 实际应该从服务器获取
            await new Promise(resolve => setTimeout(resolve, 1000))

            this.currentChallenge = {
                challenge: `anubis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
                expires: Date.now() + 600000,
                difficulty: this.config.difficulty
            }

            await this.startComputation()
        } catch (error) {
            this.updateUI('error', '获取挑战失败，请重试')
            throw error
        }
    }

    /**
     * 开始计算挑战
     */
    private async startComputation(): Promise<void> {
        if (!this.currentChallenge) {
            throw new Error('没有可用的挑战')
        }

        this.updateUI('computing', '正在进行安全计算...')

        // 模拟工作量证明计算
        const startTime = Date.now()
        let computed = 0
        const total = this.currentChallenge.difficulty

        // 使用 requestAnimationFrame 实现平滑的进度更新
        const compute = async () => {
            for (let i = 0; i < 1000; i++) {
                // 模拟计算工作
                crypto.getRandomValues(new Uint32Array(1))
                computed++

                // 更新进度
                if (computed % 10000 === 0) {
                    const progress = (computed / total) * 100
                    this.updateProgress(Math.min(progress, 100))

                    // 让出主线程以避免阻塞UI
                    if (computed % 100000 === 0) {
                        await new Promise(resolve => requestAnimationFrame(resolve))
                    }
                }

                if (computed >= total) break
            }

            if (computed < total) {
                requestAnimationFrame(compute)
            } else {
                await this.completeChallenge()
            }
        }

        compute()
    }

    /**
     * 更新UI状态
     */
    private updateUI(state: 'loading' | 'computing' | 'success' | 'error', message: string): void {
        const container = this.modalElement?.querySelector('.anubis-shield-container')
        if (!container) return

        switch (state) {
            case 'loading':
                container.innerHTML = `
          <div class="anubis-loading">
            <div class="anubis-spinner"></div>
            <p>${message}</p>
          </div>
        `
                break
            case 'computing':
                container.innerHTML = `
          <div class="anubis-challenge">
            <div class="anubis-progress">
              <div class="anubis-progress-bar" style="width: 0%"></div>
            </div>
            <div class="anubis-status">${message}</div>
          </div>
        `
                break
            case 'success':
                container.innerHTML = `
          <div class="anubis-loading">
            <div style="color: #28a745; font-size: 2rem;">✓</div>
            <p style="color: #28a745;">${message}</p>
          </div>
        `
                break
            case 'error':
                container.innerHTML = `
          <div class="anubis-loading">
            <div style="color: #dc3545; font-size: 2rem;">✗</div>
            <p style="color: #dc3545;">${message}</p>
          </div>
        `
                break
        }
    }

    /**
     * 更新进度条
     */
    private updateProgress(percent: number): void {
        const progressBar = this.modalElement?.querySelector('.anubis-progress-bar') as HTMLElement
        if (progressBar) {
            progressBar.style.width = `${percent}%`
        }

        const status = this.modalElement?.querySelector('.anubis-status')
        if (status) {
            const timeEstimate = Math.max(0, (100 - percent) / 2)
            status.textContent = `正在进行安全计算... ${Math.round(percent)}% (约${timeEstimate.toFixed(1)}秒)`
        }
    }

    /**
     * 完成挑战
     */
    private async completeChallenge(): Promise<void> {
        this.updateUI('success', '验证成功！')

        // 短暂显示成功状态
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 生成响应令牌
        const response = await this.computeResponse()

        this.resolve({
            success: true,
            token: `anubis_token_${Date.now()}`,
            challenge: this.currentChallenge?.challenge,
            response
        })
    }

    /**
     * 计算挑战响应
     */
    private async computeResponse(): Promise<string> {
        if (!this.currentChallenge) throw new Error('没有可用的挑战')

        const encoder = new TextEncoder()
        const data = encoder.encode(this.currentChallenge.challenge)
        const hash = await crypto.subtle.digest('SHA-256', data)
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
    }

    private resolve: (value: AnubisResult) => void = () => { }
    private reject: (reason?: any) => void = () => { }

    /**
     * 显示验证模态框
     */
    async verify(): Promise<AnubisResult> {
        return new Promise(async (resolve, reject) => {
            this.resolve = resolve
            this.reject = reject

            try {
                await this.initialize()

                // 设置超时
                setTimeout(() => {
                    if (this.modalElement) {
                        reject(new Error('验证超时'))
                        this.destroy()
                    }
                }, this.config.timeout)
            } catch (error) {
                reject(error)
                this.destroy()
            }
        })
    }

    /**
     * 销毁模态框
     */
    destroy(): void {
        if (this.modalElement) {
            this.modalElement.remove()
            this.modalElement = null
        }

        // 清理样式
        const style = document.getElementById('anubis-shield-styles')
        if (style) style.remove()
    }
}