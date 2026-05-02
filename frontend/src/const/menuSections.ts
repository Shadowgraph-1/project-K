import { ChartNoAxesColumn, SquareStack, UserRoundCheck, Users } from "lucide-react";

export const MENU_TOOLS = [
    {
        id:1,
        key: 'user',
        section: 'Пользователь',
        lucide: Users
    },
    {
        id:2,
        key: 'companions',
        section: 'Компаньоны',
        lucide: UserRoundCheck,
    },
    {
        id:3,
        key: 'history',
        section: 'История',
        lucide: SquareStack
    },
    {
        id:4,
        key: 'stats',
        section: 'Статистика',
        lucide: ChartNoAxesColumn
    },
]