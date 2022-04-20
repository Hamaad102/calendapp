import { User } from './User';

export interface AuthApiDataSuccess {
  message: string;
  user: User;
}

export interface AuthApiData {
  error?: { message: string };
  success?: AuthApiDataSuccess;
}
