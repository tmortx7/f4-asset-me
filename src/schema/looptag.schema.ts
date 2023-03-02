import { z } from "zod";

export const LoopTagSchema = z.object({
	tag: z.string(),
	order: z.number(),
	loopId: z.string(),
	typeId: z.string(),
	note: z.string(),

})

export const EditLoopTagSchema = LoopTagSchema.extend({
	id: z.string().uuid()
})

export type ILoopTagSchema = z.infer<typeof LoopTagSchema>
export type IEditLoopTagSchema = z.infer<typeof EditLoopTagSchema>
