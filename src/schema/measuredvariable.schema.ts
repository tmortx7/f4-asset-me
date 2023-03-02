import { z } from "zod";

export const MeasuredVariableSchema = z.object({
	variablex: z.string().min(1),
	alias: z.string().min(1),
})

export const EditMeasuredVariableSchema = MeasuredVariableSchema.extend({
	id: z.string().uuid()
})

export type IMeasuredVariableSchema = z.infer<typeof MeasuredVariableSchema>
export type IEditMeasuredVariableSchema = z.infer<typeof EditMeasuredVariableSchema>
