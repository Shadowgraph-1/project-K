import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createUserOnApi, loginUserOnApi } from "@/api/auth";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { setAuthToken } from "@/shared/lib/auth-token";
import type { RegisterInput } from "@/shared/schema/auth.schema";
import { registerSchema } from "@/shared/schema/auth.schema";
import registerImg from "@/assets/register.jpg";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/lib/notify";
import { useModalStore } from "@/shared/model/useModalStore";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

type LoginFormProps = React.ComponentProps<"div"> & {
  mode: "login" | "register";
};

function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
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
      if (result.token) setAuthToken(result.token);
      register({
        name: result.user.name,
        email: result.user.email,
      });
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
    <form
      className="p-6 md:p-8"
      onSubmit={form.handleSubmit(onValid)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-xs text-muted-foreground">Создайте аккаунт Kono</p>
        </div>
        <Field>
          <FieldLabel htmlFor="reg-name">Имя</FieldLabel>
          <Input id="reg-name" {...form.register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-email">Email</FieldLabel>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-password">Пароль</FieldLabel>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-confirm">Подтвердите пароль</FieldLabel>
          <Input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Зарегистрироваться
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Уже есть аккаунт?{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-medium underline underline-offset-4"
            onClick={onSwitchToLogin}
          >
            Войти
          </Button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

export function LoginForm({ mode, className, ...props }: LoginFormProps) {
  const openRegister = useModalStore((s) => s.openRegister);
  const openLogin = useModalStore((s) => s.openLogin);
  const closeAuthModal = useModalStore((s) => s.closeAuthModal);
  const loginUser = useAuthStore((s) => s.login);

  if (mode === "register") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <RegisterForm
              onSuccess={closeAuthModal}
              onSwitchToLogin={openLogin}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const email = String(fd.get("email") ?? "").trim();
              const password = String(fd.get("password") ?? "");
              try {
                const data = await loginUserOnApi({ email, password });
                if (data.token) setAuthToken(data.token);
                loginUser(data.user);
                closeAuthModal();
              } catch {
                notify({
                  title: "Не удалось войти",
                  description:
                    "Неверный email или пароль, либо сервер недоступен",
                  variant: "error",
                });
              }
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">C возвращением!</h1>
                <p className="text-xs text-muted-foreground">
                  Войди в ваш аккаунт, чтобы пользоваться возможностями Kono
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Введите почту"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Забыли пароль?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Войти</Button>
              </Field>
              <FieldSeparator />
              <FieldDescription className="text-center">
                Нет аккаунта{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 font-medium underline underline-offset-4"
                  onClick={openRegister}
                >
                  Зарегистрироваться
                </Button>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={registerImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
