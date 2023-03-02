import { z } from "zod";

export const LogSchema = z.object({
	log: z.string().min(1),
	siteId: z.string(),
})

export const EditLogSchema = LogSchema.extend({
	id: z.string().uuid()
})

export type ILogSchema = z.infer<typeof LogSchema>
export type IEditLogSchema = z.infer<typeof EditLogSchema>
