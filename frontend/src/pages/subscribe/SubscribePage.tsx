import { Link } from "react-router-dom";

import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { Header } from "@/widgets/header/ui/Header";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type PaymentProvider = {
  id: string;
  name: string;
  description: string;
  logo: string;
  logoClassName?: string;
};

const PAYMENT_PROVIDERS: readonly PaymentProvider[] = [
  {
    id: "yoomoney",
    name: "ЮMoney",
    description: "Оплата кошельком и банковскими картами",
    logo: "/payment-providers/yoomoney.svg",
    logoClassName: "h-6",
  },
  {
    id: "sbp",
    name: "СБП",
    description: "Система быстрых платежей по QR-коду",
    logo: "/payment-providers/sbp.svg",
    logoClassName: "h-10",
  },
  {
    id: "mir",
    name: "Мир",
    description: "Национальная платёжная система",
    logo: "/payment-providers/mir.svg",
    logoClassName: "h-7",
  },
] as const;

function PaymentProviderCard({ provider }: { provider: PaymentProvider }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
      <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] px-2">
        <img
          src={provider.logo}
          alt=""
          width={80}
          height={40}
          className={cn("w-full object-contain", provider.logoClassName)}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">
          {provider.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/40">
          {provider.description}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] font-medium text-white/50">
        Скоро
      </span>
    </li>
  );
}

function SubscribePage() {
  return (
    <div className="flex min-h-svh flex-col bg-neutral-950 text-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-24 sm:py-28">
        <section className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Подписка скоро появится
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Пока всё бесплатно — пользуйтесь Kono в полном доступе. А когда
            подписка заработает, оплатить можно будет через отечественные
            платёжные системы.
          </p>

          <div className="mt-10 w-full rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
            <p className="mb-3 text-left text-xs font-medium uppercase tracking-wider text-white/35">
              Способы оплаты
            </p>
            <ul className="grid gap-2">
              {PAYMENT_PROVIDERS.map((provider) => (
                <PaymentProviderCard key={provider.id} provider={provider} />
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-white px-5 text-neutral-950 hover:bg-neutral-200"
            >
              <Link to={SESSION_PATHS.root}>Вернуться на главную</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-transparent px-5 text-white/80 hover:bg-white/5 hover:text-white"
            >
              <Link to={SESSION_PATHS.sessionRoot}>Открыть Kono</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SubscribePage;