import { z } from "zod";

export const ModelSchema = z.object({
	model: z.string(),
	serialno: z.string(),
	note: z.string(),
	manufacturerId: z.string(),
})

export const EditModelSchema = ModelSchema.extend({
	id: z.string().uuid()
})

export type IModelSchema = z.infer<typeof ModelSchema>
export type IEditModelSchema = z.infer<typeof EditModelSchema>
