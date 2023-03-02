import { z } from "zod";

export const AssetSchema = z.object({
	description: z.string().min(1),
	note: z.string(),



})

export const EditAssetSchema = AssetSchema.extend({
	id: z.string().uuid(),
	// categoryId:z.string(),
	siteId:z.string(),
	// modelId:z.string(),
})

export type IAssetSchema = z.infer<typeof AssetSchema>
export type IEditAssetSchema = z.infer<typeof EditAssetSchema>
