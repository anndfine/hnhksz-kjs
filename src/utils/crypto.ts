// src/utils/crypto.ts
/**
 * 生成随机盐值
 */
export async function generateSalt(): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 使用 PBKDF2 派生密钥
 */
export async function deriveKey(password: string, salt: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)
  const saltBuffer = encoder.encode(salt)
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  return await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  )
}

/**
 * 将 ArrayBuffer 转换为十六进制字符串
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 完整的密码加密流程
 */
export async function encryptPassword(password: string): Promise<{
  encrypted: string
  salt: string
}> {
  const salt = await generateSalt()
  const derivedKey = await deriveKey(password, salt)
  const encrypted = bufferToHex(derivedKey)
  
  return {
    encrypted,
    salt
  }
}