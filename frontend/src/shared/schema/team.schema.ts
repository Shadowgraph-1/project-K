import { z } from "zod";

const optionalContactUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => !v || /^https?:\/\/.+/i.test(v),
    "Ссылка должна начинаться с https://",
  );

export const addTeamMemberFormSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100),
  surname: z.string().max(100).optional(),
  nickname: z.string().max(100).optional(),
  position: z.string().min(1, "Роль обязательна").max(100),
  _vk: optionalContactUrl,
  _tg: optionalContactUrl,
  _x: optionalContactUrl,
});

export type AddTeamMemberFormInput = z.infer<typeof addTeamMemberFormSchema>;

export const addTeamMemberSchema = z.object({
  name: z.string().min(1).max(100),
  surname: z.string().max(100).optional(),
  nickname: z.string().max(100).optional(),
  position: z.string().min(1).max(100),
  media: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
});

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;

export function formToTeamMemberPayload(
  data: AddTeamMemberFormInput,
): AddTeamMemberInput {
  const media = [
    { name: "VK", url: data._vk?.trim() || undefined },
    { name: "Telegram", url: data._tg?.trim() || undefined },
    { name: "X", url: data._x?.trim() || undefined },
  ].filter((m) => m.url);

  return {
    name: data.name.trim(),
    surname: data.surname?.trim() || undefined,
    nickname: data.nickname?.trim() || undefined,
    position: data.position.trim(),
    media: media.length ? media : undefined,
  };
}
