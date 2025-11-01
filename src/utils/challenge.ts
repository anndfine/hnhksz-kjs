// src/utils/challenge.ts
/**
 * 挑战-响应认证机制
 */
import { encryptPassword, bufferToHex } from './crypto'

export interface Challenge {
    challenge: string
    timestamp: number
    expires: number
}

// 存储当前挑战
let currentChallenge: Challenge | null = null

/**
 * 获取挑战（从服务器）
 */
export async function fetchChallenge(): Promise<Challenge> {
    try {
        const challengeResponse = await fetch('/api/auth/challenge', {
            method: 'GET',
            credentials: 'include'
        })

        if (!challengeResponse.ok) {
            throw new Error('获取挑战失败')
        }

        const result = await challengeResponse.json()

        if (result.success && result.data) {
            currentChallenge = result.data
            return result.data
        } else {
            throw new Error(result.message || '获取挑战失败')
        }
    } catch (error) {
        console.error('获取挑战错误:', error)
        throw error
    }
}

/**
 * 验证挑战是否有效
 */
export function validateChallenge(challenge: Challenge | null): challenge is Challenge {
    if (!challenge) return false
    const now = Date.now()
    return now >= challenge.timestamp && now <= challenge.expires
}

/**
 * 获取当前挑战
 */
export function getCurrentChallenge(): Challenge | null {
    return currentChallenge
}

/**
 * 清除当前挑战
 */
export function clearChallenge(): void {
    currentChallenge = null
}

/**
 * 执行完整的挑战-响应流程
 */
export async function performChallengeResponse(
    username: string,
    password: string
): Promise<{ challenge: string; response: string; encryptedPassword: string }> {
    try {
        // 获取挑战
        const challenge = await fetchChallenge()

        if (!validateChallenge(challenge)) {
            throw new Error('挑战无效或已过期')
        }

        // 并行执行两个加密操作
        const [encryptedResult, response] = await Promise.all([
            // 使用 PBKDF2 加密密码（慢，用于存储验证）
            encryptPassword(password),
            // 使用 SHA-256 计算挑战响应（快，用于实时验证）
            computeChallengeResponse(password, challenge.challenge)
        ])
        return {
            challenge: challenge.challenge,
            response,
            encryptedPassword: encryptedResult.encrypted
        }
    } catch (error) {
        console.error('挑战-响应流程失败:', error)
        // 清除无效的挑战
        clearChallenge()
        throw error // 重新抛出错误，让调用方处理
    }
}

/**
 * 计算挑战响应
 */
export async function computeChallengeResponse(
    password: string,
    challenge: string
): Promise<string> {
    // 使用密码和挑战字符串计算响应
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const challengeBuffer = encoder.encode(challenge)

    // 合并密码和挑战
    const combined = new Uint8Array(passwordBuffer.length + challengeBuffer.length)
    combined.set(passwordBuffer)
    combined.set(challengeBuffer, passwordBuffer.length)

    // 计算哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined)
    return bufferToHex(hashBuffer)
}