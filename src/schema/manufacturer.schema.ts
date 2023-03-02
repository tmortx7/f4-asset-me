import { z } from "zod";

export const ManufacturerSchema = z.object({
	name: z.string().min(1),
	note: z.string(),
})

export const EditManufacturerSchema = ManufacturerSchema.extend({
	id: z.string().uuid()
})

export type IManufacturerSchema = z.infer<typeof ManufacturerSchema>
export type IEditManufacturerSchema = z.infer<typeof EditManufacturerSchema>
