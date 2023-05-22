import { fetcher } from './fetcher';
import { User } from '@prisma/client';

type UserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export const signup = async (user: UserParams) => {
  return fetcher({
    url: '/api/signup',
    method: 'POST',
    body: user,
  });
};

export const signin = async (user: UserParams) => {
  return fetcher({
    url: '/api/signin',
    method: 'POST',
    body: user,
  });
};
