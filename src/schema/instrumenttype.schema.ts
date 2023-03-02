import { z } from "zod";

export const InstrumentTypeSchema = z.object({
	type: z.string(),
  description: z.string(),
  mvId: z.string().uuid(),
  instfunctionId: z.string().uuid(),
})

export const EditInstrumentTypeSchema = InstrumentTypeSchema.extend({
	id: z.string().uuid()
})

export type IInstrumentTypeSchema = z.infer<typeof InstrumentTypeSchema>
export type IEditInstrumentTypeSchema = z.infer<typeof EditInstrumentTypeSchema>
