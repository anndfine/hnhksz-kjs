// src/utils/ComputeChallenge.ts

export interface ServerChallenge {
    challenge: string;      // 挑战前缀字符串
    difficulty: number;     // 难度级别 (1-10)
    timestamp: number;      // 挑战生成时间
    expires: number;        // 过期时间
}

export interface ComputeResult {
    success: boolean;
    challenge?: string;
    nonce?: number;
    hash?: string;
    computationTime?: number;
    error?: string;
}

export class ComputeChallenge {
    private modalElement: HTMLElement | null = null;
    private currentChallenge: ServerChallenge | null = null;
    private isComputing: boolean = false;
    private computationStartTime: number = 0;

    // 在构造函数中添加合理的配置
    private readonly difficultyConfig = {
        1: { zeros: 2, description: "非常简单", maxTime: 60000 }, // 60秒
        2: { zeros: 3, description: "简单", maxTime: 120000 },     // 2分钟
        3: { zeros: 4, description: "中等", maxTime: 300000 },     // 5分钟
        4: { zeros: 5, description: "稍难", maxTime: 600000 },     // 10分钟
        5: { zeros: 6, description: "困难", maxTime: 1200000 },    // 20分钟
        6: { zeros: 8, description: "非常困难", maxTime: 2400000 }, // 40分钟
        7: { zeros: 10, description: "专家", maxTime: 3600000 },   // 60分钟
        8: { zeros: 11, description: "大师", maxTime: 4800000 },   // 80分钟
        9: { zeros: 12, description: "地狱", maxTime: 6000000 },   // 100分钟
        10: { zeros: 13, description: "极限", maxTime: 7200000 }   // 120分钟
    };

    /**
     * 启动计算挑战流程
     */
    async computeChallenge(challengeData?: ServerChallenge): Promise<ComputeResult> {
        if (this.isComputing) {
            return { success: false, error: "已有计算任务在进行中" };
        }

        try {
            this.isComputing = true;

            // 获取挑战数据
            this.currentChallenge = challengeData || await this.fetchChallengeFromServer();

            if (!this.validateChallenge(this.currentChallenge)) {
                return { success: false, error: "挑战数据无效或已过期" };
            }

            // 创建并显示UI
            this.createModal();

            // 执行工作量证明计算
            const result = await this.executeProofOfWork();

            return result;

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "计算过程发生未知错误"
            };
        } finally {
            this.cleanup();
        }
    }

    /**
     * 从服务器获取挑战数据
     */
    private async fetchChallengeFromServer(): Promise<ServerChallenge> {
        // 临时使用JSON填充，实际应从服务器获取
        const tempChallenge: ServerChallenge = {
            challenge: `anubis_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
            difficulty: 3, // 默认中等难度
            timestamp: Date.now(),
            expires: Date.now() + 600000 // 10分钟过期
        };

        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        return tempChallenge;
    }

    /**
     * 验证挑战数据有效性
     */
    private validateChallenge(challenge: ServerChallenge): boolean {
        const now = Date.now();

        if (now > challenge.expires) {
            this.updateUI('error', '挑战已过期，请刷新页面重试');
            return false;
        }

        if (!challenge.challenge || challenge.difficulty < 1 || challenge.difficulty > 10) {
            this.updateUI('error', '挑战数据格式错误');
            return false;
        }

        return true;
    }

    /**
     * 创建模态框UI
     */
    private createModal(): void {
        this.destroyModal();

        this.modalElement = document.createElement('div');
        this.modalElement.id = 'compute-challenge-modal';
        this.modalElement.innerHTML = `
            <div class="compute-modal-overlay">
                <div class="compute-modal-content">
                    <div class="compute-modal-header">
                        <div class="compute-shield-icon">🛡️</div>
                        <h3>安全验证</h3>
                        <p>正在验证访问权限</p>
                    </div>
                    <div class="compute-modal-body">
                        <div class="compute-challenge-container">
                            <div class="compute-loading">
                                <div class="compute-spinner"></div>
                                <p class="compute-status">初始化安全计算...</p>
                            </div>
                            <div class="compute-progress-area">
                                <div class="compute-progress">
                                    <div class="compute-progress-bar"></div>
                                </div>
                                <div class="compute-stats">
                                    <span class="compute-difficulty">难度: -</span>
                                    <span class="compute-time">用时: 0.0s</span>
                                    <span class="compute-hashrate">速度: 0 H/s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="compute-modal-footer">
                        <small>此验证用于防止自动化攻击，请耐心等待</small>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modalElement);
        this.applyStyles();

        // 显示挑战信息
        if (this.currentChallenge) {
            this.updateChallengeInfo();
        }
    }

    /**
     * 应用CSS样式
     */
    private applyStyles(): void {
        const style = document.createElement('style');
        style.id = 'compute-challenge-styles';
        style.textContent = `
            #compute-challenge-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9955;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .compute-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: compute-fadeIn 0.3s ease;
            }

            .compute-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 0;
                width: 90%;
                max-width: 480px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: compute-slideUp 0.4s ease;
                overflow: hidden;
                color: white;
            }

            .compute-modal-header {
                background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
                padding: 30px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .compute-shield-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 255, 0.3));
            }

            .compute-modal-header h3 {
                margin: 0 0 8px 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: #e2e8f0;
            }

            .compute-modal-header p {
                margin: 0;
                opacity: 0.8;
                font-size: 0.95rem;
                color: #94a3b8;
            }

            .compute-modal-body {
                padding: 30px;
            }

            .compute-modal-footer {
                padding: 20px 30px;
                background: rgba(0, 0, 0, 0.3);
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .compute-modal-footer small {
                color: #64748b;
                font-size: 0.85rem;
            }

            .compute-challenge-container {
                text-align: center;
            }

            .compute-loading {
                margin-bottom: 25px;
            }

            .compute-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: compute-spin 1s linear infinite;
                margin: 0 auto 20px;
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }

            .compute-status {
                margin: 0;
                font-size: 1rem;
                color: #e2e8f0;
                font-weight: 500;
            }

            .compute-progress-area {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .compute-progress {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 15px;
            }

            .compute-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
                position: relative;
                overflow: hidden;
            }

            .compute-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: compute-shine 2s infinite;
            }

            .compute-stats {
                display: flex;
                justify-content: space-between;
                font-size: 0.85rem;
                color: #94a3b8;
            }

            .compute-stats span {
                background: rgba(255, 255, 255, 0.05);
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .compute-success {
                color: #10b981;
                font-size: 2rem;
                margin-bottom: 15px;
            }

            .compute-error {
                color: #ef4444;
                font-size: 2rem;
                margin-bottom: 15px;
            }

            @keyframes compute-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes compute-slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes compute-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes compute-shine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 更新挑战信息显示
     */
    private updateChallengeInfo(): void {
        if (!this.currentChallenge || !this.modalElement) return;

        const difficultyConfig = this.difficultyConfig[this.currentChallenge.difficulty as keyof typeof this.difficultyConfig];
        const difficultyElement = this.modalElement.querySelector('.compute-difficulty');

        if (difficultyElement) {
            difficultyElement.textContent = `难度: ${this.currentChallenge.difficulty}/10 (${difficultyConfig.description})`;
        }
    }

    /**
     * 更新UI状态
     */
    private updateUI(state: 'loading' | 'computing' | 'success' | 'error', message: string): void {
        if (!this.modalElement) return;

        const container = this.modalElement.querySelector('.compute-challenge-container');
        const statusElement = this.modalElement.querySelector('.compute-status');

        if (!container || !statusElement) return;

        switch (state) {
            case 'loading':
                container.innerHTML = `
                    <div class="compute-loading">
                        <div class="compute-spinner"></div>
                        <p class="compute-status">${message}</p>
                    </div>
                    <div class="compute-progress-area">
                        <div class="compute-progress">
                            <div class="compute-progress-bar" style="width: 10%"></div>
                        </div>
                        <div class="compute-stats">
                            <span class="compute-difficulty">难度: -</span>
                            <span class="compute-time">用时: 0.0s</span>
                            <span class="compute-hashrate">速度: 0 H/s</span>
                        </div>
                    </div>
                `;
                this.updateChallengeInfo();
                break;

            case 'computing':
                if (statusElement) {
                    statusElement.textContent = message;
                }
                break;

            case 'success':
                container.innerHTML = `
                    <div class="compute-loading">
                        <div class="compute-success">✅</div>
                        <p class="compute-status" style="color: #10b981;">${message}</p>
                    </div>
                `;
                break;

            case 'error':
                container.innerHTML = `
                    <div class="compute-loading">
                        <div class="compute-error">❌</div>
                        <p class="compute-status" style="color: #ef4444;">${message}</p>
                    </div>
                `;
                break;
        }
    }

    /**
     * 更新进度信息
     */
    private updateProgress(progress: number, hashesPerSecond: number, elapsedTime: number): void {
        if (!this.modalElement) return;

        const progressBar = this.modalElement.querySelector('.compute-progress-bar') as HTMLElement;
        const timeElement = this.modalElement.querySelector('.compute-time');
        const hashrateElement = this.modalElement.querySelector('.compute-hashrate');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (timeElement) {
            timeElement.textContent = `用时: ${elapsedTime.toFixed(1)}s`;
        }

        if (hashrateElement) {
            hashrateElement.textContent = `速度: ${hashesPerSecond.toLocaleString()} H/s`;
        }
    }

    /**
     * 执行工作量证明计算
     */
    private async executeProofOfWork(): Promise<ComputeResult> {
        if (!this.currentChallenge) {
            return { success: false, error: "没有可用的挑战数据" };
        }

        this.computationStartTime = Date.now();
        const difficultyConfig = this.difficultyConfig[this.currentChallenge.difficulty as keyof typeof this.difficultyConfig];
        const requiredZeros = difficultyConfig.zeros;
        const maxTime = difficultyConfig.maxTime; // 获取配置的最大时间

        this.updateUI('computing', `正在进行安全计算 (需要${requiredZeros}个前导零)...`);

        let nonce = 0;
        let hashesComputed = 0;
        const startTime = Date.now();
        let lastUpdateTime = startTime;

        // 创建中止控制器
        const abortController = new AbortController();

        try {
            while (true) {
                // 组合挑战字符串和nonce
                const data = this.currentChallenge.challenge + nonce.toString();
                const hash = await this.computeSHA256(data);
                hashesComputed++;
                nonce++;

                // 检查是否满足难度要求
                if (hash.startsWith('0'.repeat(requiredZeros))) {
                    const computationTime = (Date.now() - this.computationStartTime) / 1000;

                    this.updateUI('success', `验证成功！用时 ${computationTime.toFixed(1)} 秒`);

                    // 短暂显示成功状态
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    return {
                        success: true,
                        challenge: this.currentChallenge.challenge,
                        nonce,
                        hash,
                        computationTime
                    };
                }

                // 定期更新UI（每100毫秒或每1000次计算）
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime > 100 || hashesComputed % 1000 === 0) {
                    const elapsedTime = (currentTime - startTime) / 1000;
                    const hashesPerSecond = Math.round(hashesComputed / elapsedTime);

                    // 估算进度（基于统计概率）
                    const probability = 1 / Math.pow(16, requiredZeros);
                    const expectedTotalHashes = 1 / probability;
                    const progress = Math.min(95, (nonce / expectedTotalHashes) * 100);

                    this.updateProgress(progress, hashesPerSecond, elapsedTime);
                    lastUpdateTime = currentTime;

                    // 让出主线程避免阻塞
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

                // 检查超时（60秒超时）
                if (currentTime - startTime > maxTime) {
                    throw new Error("计算超时，请重试");
                }

                // 检查中止信号
                if (abortController.signal.aborted) {
                    throw new Error("计算被用户中止");
                }
            }
        } catch (error) {
            this.updateUI('error', error instanceof Error ? error.message : "计算失败");
            throw error;
        }
    }

    /**
     * 计算SHA-256哈希
     */
    private async computeSHA256(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * 清理资源
     */
    private cleanup(): void {
        this.isComputing = false;
        // 不立即销毁模态框，让用户看到最终状态
        setTimeout(() => {
            this.destroyModal();
        }, 100);
    }

    /**
     * 销毁模态框
     */
    private destroyModal(): void {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }

        const style = document.getElementById('compute-challenge-styles');
        if (style) {
            style.remove();
        }
    }

    /**
     * 强制中止计算
     */
    abort(): void {
        this.cleanup();
    }
}

// 全局单例实例
let computeChallengeInstance: ComputeChallenge | null = null;

/**
 * 全局调用函数 - 执行客户端工作量证明计算
 * 
 * @param challengeData - 可选的挑战数据。如果提供，将使用此数据执行计算；
 *                        如果未提供，将自动从服务器获取挑战数据
 * 
 * @returns Promise<ComputeResult> - 返回计算结果的Promise
 * 
 * @example
 * // 方式1: 自动从服务器获取挑战
 * const result = await computeChallenge();
 * if (result.success) {
 *   // 使用 result.challenge, result.nonce, result.hash 提交到服务器
 * }
 * 
 * @example
 * // 方式2: 使用预定义的挑战数据
 * const result = await computeChallenge({
 *   challenge: "a-ciallo_1234567890_abc123",
 *   difficulty: 3,
 *   timestamp: Date.now(),
 *   expires: Date.now() + 600000
 * });
 * 
 * @example
 * // 完整登录集成示例
 * async function loginWithChallenge(username: string, password: string) {
 *   // 1. 执行安全挑战计算
 *   const challengeResult = await computeChallenge();
 *   
 *   if (!challengeResult.success) {
 *     throw new Error(`安全验证失败: ${challengeResult.error}`);
 *   }
 * 
 *   // 2. 使用挑战结果进行登录
 *   const loginData = {
 *     username,
 *     password,
 *     challenge: challengeResult.challenge!,     // 挑战字符串
 *     nonce: challengeResult.nonce!,             // 找到的nonce值
 *     proof: challengeResult.hash!,              // 计算出的哈希证明
 *     computationTime: challengeResult.computationTime! // 计算用时
 *   };
 *   
 *   return await submitLogin(loginData);
 * }
 * 
 * @remarks
 * 此函数会：
 * 1. 显示全屏模态框进行可视化计算
 * 2. 执行SHA-256工作量证明计算
 * 3. 根据服务器下发的难度要求寻找符合条件的nonce
 * 4. 返回包含完整验证数据的结果
 * 
 * 成功时返回的数据包含：
 * - challenge: string - 原始挑战字符串，用于服务器验证匹配
 * - nonce: number - 计算出的nonce值，与challenge组合满足难度要求
 * - hash: string - 完整的SHA-256哈希值，格式为16进制字符串
 * - computationTime: number - 计算用时（秒），用于服务器验证时间合理性
 * 
 * 失败时返回：
 * - success: false
 * - error: string - 详细的错误信息
 * 
 * @throws 不会抛出异常，所有错误都通过返回值的error字段处理
 * 
 * @see ComputeResult - 返回结果的完整类型定义
 * @see ServerChallenge - 挑战数据的类型定义
 * 
 * @version 1.0.0
 * @since 2024-01-01
 */
export async function computeChallenge(challengeData?: ServerChallenge): Promise<ComputeResult> {
    if (!computeChallengeInstance) {
        computeChallengeInstance = new ComputeChallenge();
    }

    return await computeChallengeInstance.computeChallenge(challengeData);
}

/**
 * 中止当前计算
 */
export function abortComputeChallenge(): void {
    if (computeChallengeInstance) {
        computeChallengeInstance.abort();
    }
}

export default computeChallenge;