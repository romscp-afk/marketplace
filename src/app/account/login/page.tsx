import { LoginNotice } from "@/components/auth/login-notice";
import { brand } from "@/config/brand";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Sign in</h1>
      <p className="text-muted mt-2 text-sm">
        Welcome back to {brand.name}
      </p>

      <LoginNotice />
      <LoginForm />
    </div>
  );
}
