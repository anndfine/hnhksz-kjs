// src/services/authService.ts
/**
 * 认证服务
 */
import { performChallengeResponse } from '@/utils/challenge'
import { apinodes } from '@/data/apinodes'

export interface LoginCredentials {
    username: string
    password: string
    challenge?: string
    response?: string
}

export interface AuthResponse {
    success: boolean
    message?: string
    data?: any
    code?: number
}

/**
 * 执行登录流程
 */

export async function performLogin(credentials: {
    username: string;
    password: string;
    challenge?: string;
    response?: string;
}): Promise<boolean> {
    try {
        let loginData: LoginCredentials

        // 如果有挑战响应参数，使用加密流程
        if (credentials.challenge && credentials.response) {
            loginData = {
                username: credentials.username,
                password: credentials.password, // 这里已经是加密后的密码
                challenge: credentials.challenge,
                response: credentials.response
            }
        } else {
            // 否则执行完整的挑战-响应流程（向后兼容）
            const challengeResult = await performChallengeResponse(
                credentials.username,
                credentials.password
            )

            if (!challengeResult) {
                throw new Error("挑战-响应流程失败")
            }

            loginData = {
                username: credentials.username,
                password: challengeResult.encryptedPassword,
                challenge: challengeResult.challenge,
                response: challengeResult.response
            }
        }
        const loginResponse = await fetch(`${apinodes[0]!.domain}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginData)
        })

        if (!loginResponse.ok) {
            console.error('登录请求失败:', loginResponse.status)
            return false
        }

        const result: AuthResponse = await loginResponse.json()
        return result.success

    } catch (error) {
        console.error('登录流程错误:', error)
        throw error
    }
}

/**
 * 获取用户信息
 */
export async function fetchUserInfo(): Promise<AuthResponse> {
    try {
        const userResponse = await fetch(`${apinodes[0]!.domain}/api/auth/me`, {
            credentials: 'include',
            method: "POST"
        })

        if (!userResponse.ok) {
            return {
                success: false,
                message: '网络错误',
                code: userResponse.status
            }
        }

        return await userResponse.json()
    } catch (error) {
        console.error('获取用户信息失败:', error)
        return {
            success: false,
            message: '网络错误',
            code: 500
        }
    }
}

/**
 * 登出
 */
export async function performLogout(): Promise<boolean> {
    try {
        await fetch(`${apinodes[0]!.domain}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        return true
    } catch (error) {
        console.error('登出失败:', error)
        return false
    }
}