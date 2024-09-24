import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface EncryptedData {
  encryptedData: string;
  iv: string;
}

interface data {
  tenantId: number;
  projectId: number;
  customRoleId: number;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

async function decryptJsonData(encryptedData: EncryptedData, secretKey: string): Promise<data> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secretKey);
  const iv = atob(encryptedData.iv).split('').map(c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(encryptedData.encryptedData).split('').map(c => c.charCodeAt(0)));

  const plaintextBytes =  await aesCbcDecrypt(ciphertext, key, new Uint8Array(iv));
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(plaintextBytes);

  return JSON.parse(jsonString);
}

async function aesCbcDecrypt(ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array):  Promise<ArrayBufferLike> {
  const algorithm = { name: 'AES-CBC', iv };
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
  const plaintext = new Uint8Array(await crypto.subtle.decrypt(algorithm, cryptoKey, ciphertext));
  return plaintext;
}


export {
  decryptJsonData, 
  cn
}