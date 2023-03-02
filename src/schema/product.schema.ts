import { z } from "zod";

export const ProductSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	price: z.number(),
})

export const EditProductSchema = ProductSchema.extend({
	id: z.string().uuid()
})

export type IProductSchema = z.infer<typeof ProductSchema>
export type IEditProductSchema = z.infer<typeof EditProductSchema>
