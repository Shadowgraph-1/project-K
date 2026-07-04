import { type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { createUserOnApi, loginUserOnApi } from "@/api/auth";
import registerImg from "@/assets/register.jpg";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { setAuthToken } from "@/shared/lib/auth-token";
import { notify } from "@/shared/lib/notify";
import { cn } from "@/shared/lib/utils";
import type { LoginInput, RegisterInput } from "@/shared/schema/auth.schema";
import { loginSchema, registerSchema } from "@/shared/schema/auth.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { KonoLogo } from "@/shared/ui/kono-logo";

import { AUTH_PATHS, authPathWithRedirect } from "./auth-paths";

type AuthMode = "login" | "register";

const authInputClassName =
  "h-10 rounded-lg border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0 dark:bg-white/[0.04] dark:disabled:bg-white/[0.04]";

function AuthField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 text-sm font-normal leading-none text-white/70"
      >
        {label}
      </label>
      <div className="relative">{children}</div>
      <p
        className={cn(
          "min-h-5 text-sm",
          error ? "text-red-400" : "text-transparent",
        )}
      >
        {error ?? "\u00a0"}
      </p>
    </div>
  );
}

function AuthImagePanel({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-neutral-900", className)}>
      <img
        src={registerImg}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-neutral-950/30" />
    </div>
  );
}

function LoginPanel({
  redirectTo,
  onSuccess,
}: {
  redirectTo: string;
  onSuccess: () => void;
}) {
  const loginUser = useAuthStore((s) => s.login);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onValid(data: LoginInput) {
    try {
      const result = await loginUserOnApi(data);
      if (!result.token || !result.user) {
        throw new Error("invalid_auth_response");
      }
      setAuthToken(result.token);
      loginUser(result.user);
      onSuccess();
    } catch {
      notify({
        title: "Не удалось войти",
        description: "Неверный email или пароль, либо сервер недоступен",
        variant: "error",
      });
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <>
      <h1 className="mb-10 text-center text-2xl font-medium tracking-tight text-white sm:text-3xl">
        Войти в ваш аккаунт
      </h1>

      <form
        className="grid gap-1"
        onSubmit={form.handleSubmit(onValid)}
      >
        <AuthField label="Email" htmlFor="login-email" error={errors.email?.message}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            className={authInputClassName}
            aria-invalid={Boolean(errors.email)}
            {...form.register("email")}
          />
        </AuthField>

        <AuthField
          label="Пароль"
          htmlFor="login-password"
          error={errors.password?.message}
        >
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={authInputClassName}
            aria-invalid={Boolean(errors.password)}
            {...form.register("password")}
          />
        </AuthField>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 h-10 w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-200"
        >
          Войти
        </Button>
      </form>

      <p className="text-center text-sm text-white/45">
        Нет аккаунта?{" "}
        <Link
          to={authPathWithRedirect(AUTH_PATHS.register, redirectTo)}
          className="text-white/80 hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </>
  );
}

function RegisterPanel({
  redirectTo,
  onSuccess,
}: {
  redirectTo: string;
  onSuccess: () => void;
}) {
  const register = useAuthStore((s) => s.register);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onValid(data: RegisterInput) {
    try {
      const result = await createUserOnApi({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (!result.token || !result.user) {
        throw new Error("invalid_auth_response");
      }
      setAuthToken(result.token);
      register(result.user);
      onSuccess();
    } catch {
      notify({
        title: "Не удалось зарегистрироваться",
        description: "Проверьте данные и попробуйте снова",
        variant: "error",
      });
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <>
      <h1 className="mb-10 text-center text-2xl font-medium tracking-tight text-white sm:text-3xl">
        Создать аккаунт
      </h1>

      <form
        className="grid gap-1"
        onSubmit={form.handleSubmit(onValid)}
      >
        <AuthField label="Имя" htmlFor="reg-name" error={errors.name?.message}>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input
                id="reg-name"
                maxLength={FIELD_LIMITS.userName}
                className={authInputClassName}
                aria-invalid={Boolean(errors.name)}
                {...field}
              />
            )}
          />
        </AuthField>

        <AuthField label="Email" htmlFor="reg-email" error={errors.email?.message}>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            className={authInputClassName}
            aria-invalid={Boolean(errors.email)}
            {...form.register("email")}
          />
        </AuthField>

        <AuthField
          label="Пароль"
          htmlFor="reg-password"
          error={errors.password?.message}
        >
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            className={authInputClassName}
            aria-invalid={Boolean(errors.password)}
            {...form.register("password")}
          />
        </AuthField>

        <AuthField
          label="Подтвердите пароль"
          htmlFor="reg-confirm"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            className={authInputClassName}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />
        </AuthField>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 h-10 w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-200"
        >
          Создать аккаунт
        </Button>
      </form>

      <p className="text-center text-sm text-white/45">
        Уже есть аккаунт?{" "}
        <Link
          to={authPathWithRedirect(AUTH_PATHS.login, redirectTo)}
          className="text-white/80 hover:underline"
        >
          Войти
        </Link>
      </p>
    </>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const redirectTo =
    searchParams.get("redirect")?.trim() || SESSION_PATHS.sessionRoot;

  if (mode === "login" && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSuccess = () => {
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="grid min-h-dvh bg-neutral-950 lg:grid-cols-2">
      <div className="flex h-full min-h-dvh w-full flex-col overflow-y-auto">
        <div className="flex w-full items-center justify-between p-5">
          <KonoLogo
            as="link"
            to="/"
            size="sm"
            inverted
            wordmarkClassName="text-white"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-4">
          <div className="flex w-full grow items-center justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
              {mode === "register" && isAuthenticated && user ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-white/60">
                  <p>
                    Сейчас вы вошли как{" "}
                    <span className="font-medium text-white/85">
                      {user.email}
                    </span>
                    .
                  </p>
                  <p className="mt-1">
                    Новая регистрация заменит текущую сессию на этом устройстве.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
                      onClick={() => logout()}
                    >
                      Выйти и создать новый
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-white text-neutral-950 hover:bg-neutral-200"
                    >
                      <Link to={SESSION_PATHS.sessionRoot}>К проектам</Link>
                    </Button>
                  </div>
                </div>
              ) : null}

              {mode === "login" ? (
                <LoginPanel redirectTo={redirectTo} onSuccess={handleSuccess} />
              ) : (
                <RegisterPanel
                  redirectTo={redirectTo}
                  onSuccess={handleSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthImagePanel className="hidden min-h-dvh lg:block" />
    </div>
  );
}
