import KaguyaRound from "@/assets/character/Kaguya_round.jpg";
import LillyFace from "@/assets/character/Lilly_round.jpg";

export type WorkspaceStatus = "new" | "active" | "pause" | "abandoned";

export const STATUS_CONFIG: Record<
  WorkspaceStatus,
  { label: string; dot: string; text: string }
> = {
  new: { label: "Новый", dot: "bg-blue-400", text: "text-blue-600" },
  active: { label: "Активен", dot: "bg-green-400", text: "text-green-700" },
  pause: { label: "Пауза", dot: "bg-amber-400", text: "text-amber-700" },
  abandoned: { label: "Заброшен", dot: "bg-red-400", text: "text-red-600" },
} as const;

export const SESSION_CHARACTERS = [
  { id: "nekko", name: "Лилли", avatar: LillyFace },
  { id: "kaguya", name: "Кагуя", avatar: KaguyaRound },
] as const;

export type SessionCharacter = (typeof SESSION_CHARACTERS)[number];

export function live2dModelIndexForCharacter(characterId: string): number {
  const i = SESSION_CHARACTERS.findIndex((c) => c.id === characterId);
  return i === -1 ? 0 : i;
}
