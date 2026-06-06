import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
    const token = await createToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return res;
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
