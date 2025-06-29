import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register - Movie Platform',
  description: 'Create a new account on Movie Platform',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  );
}
