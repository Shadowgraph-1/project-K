import { SECTION_ID } from "@/shared/config/sectionIds";

export const FEATURE_CARDS = [
  {
    title: "Бэкенд и данные",
    description:
      "Fastify, TypeScript, Prisma и PostgreSQL: пользователи, воркспейсы, проекты, задачи, участники, история статусов, поиск и пагинация.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "Интерфейс Kono",
    description:
      "Канбан с перетаскиванием, табличный список, карточка задачи, комментарии, спринты и личный кабинет — один клиент поверх вашего API.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "ИИ-компаньон",
    description:
      "План на день, разбивка задачи на подзадачи, боковой чат с контекстом проекта и персонажи с разным тоном ответов.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "Админка и доводка",
    description:
      "Роли, уведомления в приложении и по почте, лента активности, скелетоны, тосты, онбординг, горячие клавиши и палитра команд.",
    buttonLink: SECTION_ID.LINES,
  },
] as const;
