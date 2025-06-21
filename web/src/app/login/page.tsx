import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Login - Movie Platform',
  description: 'Sign in to your Movie Platform account',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
