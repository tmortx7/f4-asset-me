import { z } from "zod";

export const LoopSchema = z.object({
	loop: z.string(),
	siteId: z.string(),
	mvId: z.string(),
	numberic: z.number(),
	service: z.string(),

})

export const EditLoopSchema = LoopSchema.extend({
	id: z.string().uuid(),
	service: z.string(),
	loop: z.string()
})

export type ILoopSchema = z.infer<typeof LoopSchema>
export type IEditLoopSchema = z.infer<typeof EditLoopSchema>
