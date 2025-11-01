// src/utils/challenge.ts
/**
 * Challenge 机制抵御暴力破解
 */

// 存储客户端的 challenge 状态
let currentChallenge: string | null = null
let challengeExpiry: number = 0

/**
 * 生成随机 challenge
 */
export function generateChallenge(): string {
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  currentChallenge = Array.from(challenge).map(b => b.toString(16).padStart(2, '0')).join('')
  challengeExpiry = Date.now() + 5 * 60 * 1000 // 5分钟过期
  return currentChallenge
}

/**
 * 验证 challenge 是否有效
 */
export function validateChallenge(challenge: string): boolean {
  return challenge === currentChallenge && Date.now() < challengeExpiry
}

/**
 * 清除 challenge
 */
export function clearChallenge(): void {
  currentChallenge = null
  challengeExpiry = 0
}

/**
 * 获取当前 challenge
 */
export function getCurrentChallenge(): string | null {
  return currentChallenge
}