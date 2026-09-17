export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData extends Credentials {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
