import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  loginSchema,
  registerSchema,
} from "@/features/auth/model/authSchemas"
import { useAuthStore } from "@/features/auth/model/useAuthStore"
import { useModalStore } from "@/shared/stores/useModalStore"



type AuthModalContentProps = {
  mode: 'login' | 'register'
}

type AuthFormValues = {
  name?: string
  email: string
  password: string
  confirmPassword?: string
}

export function AuthModalContent({ mode }: AuthModalContentProps) {
  const isRegister = mode === 'register'
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const login = useAuthStore((state) => state.login)
  const registerUser = useAuthStore((state) => state.register)
  const closeAuthModal = useModalStore((state) => state.closeAuthModal)

  const onSubmit = (data: AuthFormValues) => {
    if (isRegister) {
      registerUser({
        name: data.name ?? "",
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword ?? "",
      });
    } else {
      login({
        email: data.email,
        password: data.password,
      })
    }

    closeAuthModal()
  }

  return (
    <div className="w-full max-w-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950">
          {isRegister ? 'Регистрация' : 'Вход'}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isRegister
            ? 'Создайте аккаунт, чтобы сохранять прогресс.'
            : 'Войдите, чтобы продолжить работу с сессиями.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {isRegister && (
          <div>
            <input
              type="text"
              placeholder="Имя"
              {...register('name')}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Пароль"
            {...register('password')}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {isRegister && (
          <div>
            <input
              type="password"
              placeholder="Повторите пароль"
              {...register('confirmPassword')}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          {isRegister ? 'Создать аккаунт' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
