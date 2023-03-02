import { z } from "zod";

export const CategorySchema = z.object({
	category: z.string().min(1),
	description: z.string().min(1),
})

export const EditCategorySchema = CategorySchema.extend({
	id: z.string().uuid()
})

export type ICategorySchema = z.infer<typeof CategorySchema>
export type IEditCategorySchema = z.infer<typeof EditCategorySchema>
