import { SquareStack, Users } from "lucide-react";

export const MENU_TOOLS = [
  {
    id: 1,
    key: "user",
    section: "Пользователь",
    lucide: Users,
  },
  {
    id: 3,
    key: "history",
    section: "История",
    lucide: SquareStack,
  },
] as const;
