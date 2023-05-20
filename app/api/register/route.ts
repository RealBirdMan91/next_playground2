import { createJWT, hashPassword } from '@/utils/auth';
import { db } from '@/utils/db';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';
import { type } from 'os';

interface IRequest {
  json: () => Promise<User>;
}

export async function POST(request: IRequest) {
  const { email, password, firstName, lastName } = await request.json();

  const user = await db.user.create({
    data: {
      email: email,
      password: await hashPassword(password),
      firstName: firstName,
      lastName: lastName,
    },
  });

  const jwt = await createJWT(user);

  const response = NextResponse.json(
    {
      user: user.id,
      message: 'User created',
    },
    {
      status: 201,
    }
  );

  response.cookies.set({
    name: 'jwt',
    value: jwt,
    httpOnly: true,
    maxAge: 60 * 60,
  });

  return response;
}
