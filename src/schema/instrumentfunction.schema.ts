import { z } from "zod";

export const InstrumentFunctionSchema = z.object({
	functionx: z.string().min(1),
	alias: z.string().min(1),
})

export const EditInstrumentFunctionSchema = InstrumentFunctionSchema.extend({
	id: z.string().uuid()
})

export type IInstrumentFunctionSchema = z.infer<typeof InstrumentFunctionSchema>
export type IEditInstrumentFunctionSchema = z.infer<typeof EditInstrumentFunctionSchema>
