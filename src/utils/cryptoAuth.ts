// Cryptographic helper for secure hashing and token generation using Web Crypto API

export async function sha256Hash(text: string, salt: string = 'desa_brabo_2026_salt'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${text}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSessionToken(): string {
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateRandomCaptcha(): { id: string; question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 12) + 3;
  const num2 = Math.floor(Math.random() * 9) + 2;
  const id = `CAP-${Date.now()}`;
  return {
    id,
    question: `Berapakah hasil dari ${num1} + ${num2}?`,
    answer: num1 + num2
  };
}
