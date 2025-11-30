// src/utils/challenge.ts
/**
 * 挑战-响应认证机制
 */
import { encryptPassword, bufferToHex } from './crypto'

import { computeChallenge } from '@/utils/ComputeChallenge';

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
            throw new Error('获取挑战失败，认证服务器可能维护或故障')
        }
        try {
            // const result = await challengeResponse.json()
            const result = {
                success: true,
                data: {
                    challenge: 'example_challenge',
                    timestamp: Date.now(),
                    expires: Date.now() + 600000 // 10分钟过期
                }
            }
            if (result.success && result.data) {
                currentChallenge = result.data
                return result.data
            } else {
                throw new Error('获取挑战信息不正确')
            }
        } catch (getcerr) {
            throw new Error(`解析挑战失败，数据结构不正确，认证服务器可能维护相关功能或故障`)
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
): Promise<{
    response: string; encryptedPassword: string,
    challenge: string
}> {
    try {


        // 并行执行两个加密操作
        const [encryptedResult, challengeResponse] = await Promise.all([
            // 使用 PBKDF2 加密密码（慢，用于存储验证）
            encryptPassword(username, password),
            // 使用 SHA-256 计算挑战响应（快，用于实时验证，同时增大恶意请求成本）
            computeChallengeResponse(password)
        ])
        return {
            challenge: challengeResponse.challenge,
            response: challengeResponse.response,
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
    password: string
): Promise<{ response: string, challenge: string }> {
    const result = await computeChallenge();
    console.log(result)
    if (result.response && result.challenge) {
        return {
            response: result.response!,
            challenge: result.challenge!
        }
    }
    throw new Error('计算挑战响应失败，哈希值为空')
}