import { z } from "zod";

export const todoFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이내로 입력해주세요"),
  description: z.string().max(500, "설명은 500자 이내로 입력해주세요").optional(),
});
