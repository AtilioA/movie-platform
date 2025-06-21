'use client';

type AuthFormProps = {
  type: 'login' | 'register';
};

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";


export function AuthForm({ type }: AuthFormProps) {
  if (type === "login") return <LoginForm />;
  return <RegisterForm />;
}
