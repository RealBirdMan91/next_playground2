import { createJWT, hashPassword } from '@/utils/auth';
import { db } from '@/utils/db';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface IRequest extends NextRequest {
  json: () => Promise<User>;
}

export async function POST(request: IRequest) {
  const { email, password, firstName, lastName } = await request.json();

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        message: 'User already exists',
      },
      {
        status: 422,
      }
    );
  }

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
