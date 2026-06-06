import { SignJWT, jwtVerify } from 'jose';

const ADMIN_EMAIL = 'danboude@gmail.com';
const ADMIN_PASSWORD = 'abd2000';

export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dockers-cooldenim-secret-key-2024'
);

export function verifyCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
