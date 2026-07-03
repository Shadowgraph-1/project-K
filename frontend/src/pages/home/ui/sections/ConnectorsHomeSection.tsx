import { Link } from "react-router-dom";
import { ArrowRight, PlugZap } from "lucide-react";

import { ConnectorIcon } from "@/pages/session/ui/connectors/ConnectorIcon";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import {
  MORE_RECOMMENDED_CONNECTORS,
  RECOMMENDED_CONNECTORS,
} from "@/shared/config/connectors";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { Button } from "@/shared/ui/button";

const CONNECTOR_SHOWCASE = [
  ...RECOMMENDED_CONNECTORS,
  ...MORE_RECOMMENDED_CONNECTORS,
];

export default function ConnectorsHomeSection() {
  return (
    <section
      id={SECTION_ID.CONNECTORS}
      className="scroll-mt-20 border-t border-white/8 bg-black py-20 sm:py-28"
    >
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
        <div className="max-w-3xl" data-aos="fade-up">
          <div className="flex items-center gap-2">
            <PlugZap className="size-4 text-white" aria-hidden />
            <p className="text-sm font-medium text-white/40">Коннекторы</p>
          </div>
          <h2 className="mt-4 text-pretty text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Сервисы команды рядом с задачами
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/45 sm:text-lg">
            Telegram, Slack, Notion и другие инструменты — уведомления и
            синхронизация там, где команда уже работает.
          </p>
        </div>

        <div
          className="mt-12 rounded-2xl border border-white/8 bg-[rgb(10,10,10)] p-5 sm:p-6 lg:mt-16"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {CONNECTOR_SHOWCASE.map((connector) => {
              const available = connector.available === true;
              return (
                <li
                  key={connector.id}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2.5"
                >
                  <ConnectorIcon connector={connector} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/88">
                      {connector.name}
                    </p>
                    {connector.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/38">
                        {connector.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-white/35">
                    {available ? "Доступно" : "Скоро"}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/8 pt-5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-white/15 bg-transparent px-4 text-white/80 shadow-none hover:bg-white/[0.05] hover:text-white"
            >
              <Link to={SESSION_PATHS.connectors}>
                Открыть коннекторы
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
