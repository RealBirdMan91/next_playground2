import { createJWT, comparePassword } from '@/utils/auth';
import { db } from '@/utils/db';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type LoginRequest = Pick<User, 'email' | 'password'>;

interface IRequest extends NextRequest {
  json: () => Promise<LoginRequest>;
}

export async function POST(request: IRequest) {
  const { email, password } = await request.json();

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (
    !existingUser ||
    !(await comparePassword(password, existingUser.password))
  ) {
    return NextResponse.json(
      {
        message: 'Invalid credentials',
      },
      {
        status: 422,
      }
    );
  }

  const jwt = await createJWT(existingUser);

  const response = NextResponse.json({
    user: existingUser.id,
    message: 'User signed in',
  });

  response.cookies.set({
    name: 'jwt',
    value: jwt,
    httpOnly: true,
    maxAge: 60 * 60,
  });

  return response;
}
