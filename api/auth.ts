import { fetcher } from './fetcher';
import { User } from '@prisma/client';

type UserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export const register = async (user: UserParams) => {
  return fetcher({
    url: '/api/register',
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
