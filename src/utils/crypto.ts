// src/utils/crypto.ts
/**
 * 生成随机盐值
 */
export async function generateSalt(username: string): Promise<string> {
  // 使用用户名作为基础，加上固定前缀确保安全性
  const baseSalt = `hnhksz_${username}_salt`;
  const encoder = new TextEncoder();
  const baseBuffer = encoder.encode(baseSalt);

  // 使用SHA-256生成固定但唯一的盐值
  const hashBuffer = await crypto.subtle.digest('SHA-256', baseBuffer);
  return bufferToHex(hashBuffer).substring(0, 32); // 取前32字符作为盐值

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
export async function encryptPassword(username: string, password: string): Promise<{
  encrypted: string
  salt: string
}> {
  const salt = await generateSalt(username);
  const derivedKey = await deriveKey(password, salt)
  const encrypted = bufferToHex(derivedKey)

  return {
    encrypted,
    salt
  }
}