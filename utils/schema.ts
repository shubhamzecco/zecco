import z from "zod";

export const preferenceSchema = z.object({
    selectedLocation: z.any().optional(),
    category: z.array(z.number()).default([]),
    location: z.string().nullable().optional(),
    budget: z.string().nullable().optional(),
    bedrooms: z.array(z.string()).default([]),
    investmentType: z.array(z.string()).default([]),
    types: z.array(z.string()).default([]),
});
