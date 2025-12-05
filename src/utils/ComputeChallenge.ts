// src/utils/ComputeChallenge.ts

import { apinodes } from '@/data/apinodes'
export interface ServerChallenge {
    challenge: string;      // 挑战前缀字符串
    difficulty: number;     // 难度级别 (1-10)
    timestamp: number;      // 挑战生成时间
    expires: number;        // 过期时间
}

export interface ComputeResult {
    success: boolean;
    response?: string;
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
    private abortController: AbortController | null = null;

    // 在构造函数中添加合理的配置
    private readonly difficultyConfig = {
        1: { zeros: 2, description: "非常简单", maxTime: 60000 }, // 60秒
        2: { zeros: 3, description: "简单", maxTime: 120000 },     // 2分钟
        3: { zeros: 4, description: "中等", maxTime: 300000 },     // 5分钟
        4: { zeros: 5, description: "稍难", maxTime: 600000 },     // 10分钟
        5: { zeros: 6, description: "困难", maxTime: 1200000 },    // 20分钟
        6: { zeros: 7, description: "非常困难", maxTime: 2400000 }, // 40分钟
        7: { zeros: 8, description: "专家", maxTime: 3600000 },   // 60分钟
        8: { zeros: 9, description: "大师", maxTime: 4800000 },   // 80分钟
        9: { zeros: 10, description: "地狱", maxTime: 6000000 },   // 100分钟
        10: { zeros: 11, description: "极限", maxTime: 7200000 }   // 120分钟
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
            this.abortController = new AbortController();

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
        // 1. 获取挑战
        const challengeResponse = await fetch(`${apinodes[0]!.domain}/api/auth/challenge`);
        const challengeData = await challengeResponse.json();

        if (!challengeData.success) {
            throw new Error('获取挑战失败');
        }
        else {
            return challengeData.data as ServerChallenge;
        }
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
                        <div class="compute-header-title">
                            <h3>安全验证</h3>
                            <button class="compute-close-btn" aria-label="关闭">&times;</button>
                        </div>
                        <p>此验证用于防止自动化攻击爆破</p>
                    </div>
                    <div class="compute-modal-body">
                        <div class="compute-challenge-container">
                            <div class="compute-loading">
                                <div class="compute-spinner"></div>
                                <p class="compute-status">正在初始化安全计算...</p>
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
                            <div class="compute-controls">
                                <button class="compute-cancel-btn">终止计算</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modalElement);
        this.applyStyles();

        // 添加事件监听器
        this.setupEventListeners();

        // 显示挑战信息
        if (this.currentChallenge) {
            this.updateChallengeInfo();
        }
    }

    /**
     * 设置事件监听器
     */
    private setupEventListeners(): void {
        if (!this.modalElement) return;

        // 关闭按钮
        const closeBtn = this.modalElement.querySelector('.compute-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.abort());
        }

        // 取消/终止按钮
        const cancelBtn = this.modalElement.querySelector('.compute-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.abort());
        }

        // ESC键关闭
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * 处理键盘事件
     */
    private handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.abort();
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
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: compute-fadeIn 0.2s ease;
            }

            .compute-modal-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                width: 90%;
                max-width: 420px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                animation: compute-slideUp 0.3s ease;
                overflow: hidden;
                color: #333;
            }

            .compute-modal-header {
                padding: 20px 24px 16px;
                border-bottom: 1px solid #e5e7eb;
                background: #f8fafc;
            }

            .compute-header-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .compute-modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .compute-close-btn {
                background: none;
                border: none;
                font-size: 24px;
                line-height: 1;
                color: #6b7280;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .compute-close-btn:hover {
                background: #f3f4f6;
                color: #374151;
            }

            .compute-modal-header p {
                margin: 0;
                font-size: 14px;
                color: #6b7280;
                line-height: 1.4;
            }

            .compute-modal-body {
                padding: 24px;
            }

            .compute-modal-footer {
                padding: 16px 24px;
                background: #f9fafb;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }

            .compute-modal-footer small {
                color: #9ca3af;
                font-size: 13px;
            }

            .compute-challenge-container {
                text-align: center;
            }

            .compute-loading {
                margin-bottom: 24px;
            }

            .compute-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: compute-spin 1s linear infinite;
                margin: 0 auto 16px;
            }

            .compute-status {
                margin: 0;
                font-size: 15px;
                color: #374151;
                font-weight: 500;
            }

            .compute-progress-area {
                margin-bottom: 20px;
            }

            .compute-progress {
                width: 100%;
                height: 6px;
                background: #e5e7eb;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 12px;
            }

            .compute-progress-bar {
                height: 100%;
                background: #3b82f6;
                border-radius: 3px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .compute-stats {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                color: #6b7280;
            }

            .compute-stats span {
                background: #f3f4f6;
                padding: 4px 8px;
                border-radius: 4px;
            }

            .compute-controls {
                margin-top: 20px;
            }

            .compute-cancel-btn {
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                color: #374151;
                padding: 8px 16px;
                font-size: 14px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .compute-cancel-btn:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
            }

            .compute-success {
                color: #10b981;
                font-size: 40px;
                margin-bottom: 12px;
            }

            .compute-error {
                color: #ef4444;
                font-size: 40px;
                margin-bottom: 12px;
            }

            @keyframes compute-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes compute-slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes compute-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
                        <p class="compute-status">正在初始化安全计算...</p>
                    </div>
                    <div class="compute-progress-area">
                        <div class="compute-progress">
                            <div class="compute-progress-bar" style="width: 5%"></div>
                        </div>
                        <div class="compute-stats">
                            <span class="compute-difficulty">难度: -</span>
                            <span class="compute-time">用时: 0.0s</span>
                            <span class="compute-hashrate">速度: 0 H/s</span>
                        </div>
                    </div>
                    <div class="compute-controls">
                        <button class="compute-cancel-btn">终止计算</button>
                    </div>
                `;
                this.updateChallengeInfo();
                this.setupEventListeners();
                break;

            case 'computing':
                if (statusElement) {
                    statusElement.textContent = message;
                }
                break;

            case 'success':
                container.innerHTML = `
                    <div class="compute-loading">
                        <p class="compute-status" style="color: #10b981;">${message}</p>
                    </div>
                    <div class="compute-controls">
                        <button class="compute-cancel-btn" onclick="document.querySelector('.compute-close-btn')?.click()">关闭</button>
                    </div>
                `;
                break;

            case 'error':
                container.innerHTML = `
                    <div class="compute-loading">
                        <p class="compute-status" style="color: #ef4444;">${message}</p>
                    </div>
                    <div class="compute-controls">
                        <button class="compute-cancel-btn" onclick="document.querySelector('.compute-close-btn')?.click()">关闭</button>
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
        const maxTime = difficultyConfig.maxTime;

        this.updateUI('computing', '该操作根据设备性能而异，可能需要数秒到十几秒时间');

        let nonce = 0;
        let totalHashesComputed = 0;
        const startTime = Date.now();
        let lastUpdateTime = startTime;

        // 🔥 动态调整批量大小
        let batchSize = 1000; // 初始批量大小

        try {
            while (true) {
                if (this.abortController?.signal.aborted) {
                    throw new Error("计算被用户中止");
                }

                // 🔥 使用批量计算方法
                const batchResult = await this.computeSHA256Batch(
                    this.currentChallenge.challenge,
                    nonce,
                    batchSize
                );

                totalHashesComputed += batchSize;
                nonce += batchSize;

                // 检查是否找到答案
                if (batchResult.foundIndex !== null && batchResult.foundHash) {
                    const foundNonce = nonce - batchSize + batchResult.foundIndex;
                    const foundData = this.currentChallenge.challenge + foundNonce.toString();
                    const computationTime = (Date.now() - this.computationStartTime) / 1000;

                    this.updateUI('success', `验证成功！用时 ${computationTime.toFixed(1)} 秒`);
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    return {
                        success: true,
                        challenge: this.currentChallenge.challenge,
                        response: foundData,
                        nonce: foundNonce,
                        hash: batchResult.foundHash,
                        computationTime
                    };
                }

                // 🔥 动态调整批量大小（根据性能）
                if (totalHashesComputed % 10000 === 0) {
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    const hashesPerSecond = totalHashesComputed / elapsedTime;

                    // 如果性能好，增加批量大小
                    if (hashesPerSecond > 50000 && batchSize < 5000) {
                        batchSize = Math.min(5000, batchSize * 2);
                    }
                    // 如果性能差，减少批量大小
                    else if (hashesPerSecond < 10000 && batchSize > 100) {
                        batchSize = Math.max(100, Math.floor(batchSize / 2));
                    }
                }

                // 🔥 减少UI更新频率（300ms更新一次）
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime > 300) {
                    const elapsedTime = (currentTime - startTime) / 1000;
                    const hashesPerSecond = Math.round(totalHashesComputed / elapsedTime);

                    // 估算进度
                    const probability = 1 / Math.pow(16, requiredZeros);
                    const expectedTotalHashes = 1 / probability;
                    const progress = Math.min(95, (nonce / expectedTotalHashes) * 100);

                    this.updateProgress(progress, hashesPerSecond, elapsedTime);
                    lastUpdateTime = currentTime;
                }

                // 检查超时
                if (currentTime - startTime > maxTime) {
                    throw new Error("计算超时，请重试");
                }
            }
        } catch (error) {
            this.updateUI('error', error instanceof Error ? error.message : "计算失败");
            await new Promise(resolve => setTimeout(resolve, 1500));
            throw error;
        }
    }

    /**
     * 批量计算SHA-256哈希（提高GPU利用率）
     */
    private async computeSHA256Batch(challenge: string, startNonce: number, batchSize: number): Promise<{
        hashes: string[],
        foundIndex: number | null,
        foundHash: string | null
    }> {
        const encoder = new TextEncoder();
        const promises: Promise<string>[] = [];

        // 检查是否有当前挑战数据
        if (!this.currentChallenge) {
            throw new Error("当前挑战数据不存在");
        }

        const currentDifficulty = this.currentChallenge.difficulty;
        const requiredZeros = this.difficultyConfig[currentDifficulty as keyof typeof this.difficultyConfig].zeros;

        // 准备所有计算任务
        for (let i = 0; i < batchSize; i++) {
            const data = challenge + (startNonce + i).toString();
            const dataBuffer = encoder.encode(data);

            // 创建Promise但不立即await
            promises.push(
                crypto.subtle.digest('SHA-256', dataBuffer)
                    .then(hashBuffer =>
                        Array.from(new Uint8Array(hashBuffer))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('')
                    )
            );
        }

        // 🔥 并行计算所有哈希
        const hashes = await Promise.all(promises);

        // 检查是否有符合条件的哈希
        for (let i = 0; i < hashes.length; i++) {
            const currentHash = hashes[i];

            // 检查是否为有效的字符串
            if (!currentHash || typeof currentHash !== 'string') {
                console.warn(`无效的哈希值 at index ${i}:`, currentHash);
                continue; // 跳过无效值
            }

            // 直接检查难度
            if (currentHash.startsWith('0'.repeat(requiredZeros))) {
                return {
                    hashes,
                    foundIndex: i,
                    foundHash: currentHash  // currentHash 已确认是 string
                };
            }
        }

        return {
            hashes,
            foundIndex: null,
            foundHash: null  // 🔥 明确返回 null
        };
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
        // 移除键盘事件监听器
        document.removeEventListener('keydown', this.handleKeydown.bind(this));

        // 不立即销毁模态框，让用户看到最终状态
        setTimeout(() => {
            this.destroyModal();
        }, 1000); // 成功或错误状态显示1秒后关闭
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
        if (this.abortController) {
            this.abortController.abort();
        }
        this.updateUI('error', '计算已终止');
        setTimeout(() => this.destroyModal(), 1500);
    }
}

// 全局单例实例
let computeChallengeInstance: ComputeChallenge | null = null;

/**
 * 全局调用函数 - 执行客户端工作量证明计算
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