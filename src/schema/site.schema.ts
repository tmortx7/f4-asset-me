import { z } from "zod";

export const SiteSchema = z.object({
	site: z.string().min(1),
	alias: z.string().min(1),
	note: z.string().min(1),
	categoryId: z.string(),
})

export const EditSiteSchema = SiteSchema.extend({
	id: z.string().uuid()
})

export type ISiteSchema = z.infer<typeof SiteSchema>
export type IEditSiteSchema = z.infer<typeof EditSiteSchema>
