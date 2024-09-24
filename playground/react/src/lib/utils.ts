import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


interface EncryptedData {
  encryptedData: string;
  iv: string;
}

async function encryptJsonData(jsonData: any, secretKey: string): Promise<EncryptedData> {
  const jsonString = JSON.stringify(jsonData);
  const encoder = new TextEncoder();
  const key = encoder.encode(secretKey);
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const plaintextBytes = encoder.encode(jsonString);
  const ciphertext = await aesCbcEncrypt(plaintextBytes, key, iv);

  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

async function decryptJsonData(encryptedData: EncryptedData, secretKey: string): Promise<any> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secretKey);
  const iv = atob(encryptedData.iv).split('').map(c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(encryptedData.encryptedData).split('').map(c => c.charCodeAt(0)));

  const plaintextBytes =  await aesCbcDecrypt(ciphertext, key, new Uint8Array(iv));
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(plaintextBytes);

  return JSON.parse(jsonString);
}

async function aesCbcEncrypt(plaintext: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<ArrayBufferLike> {
  const algorithm = { name: 'AES-CBC', iv };
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['encrypt']);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(algorithm, cryptoKey, plaintext));
  return ciphertext;
}

async function aesCbcDecrypt(ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array):  Promise<ArrayBufferLike> {
  const algorithm = { name: 'AES-CBC', iv };
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
  const plaintext = new Uint8Array(await crypto.subtle.decrypt(algorithm, cryptoKey, ciphertext));
  return plaintext;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export {
  cn,
  encryptJsonData,
  decryptJsonData
}


// Example usage

