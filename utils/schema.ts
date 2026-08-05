import z from "zod";

export const preferenceSchema = z.object({
    selectedLocation: z.any().optional(),
    category: z.array(z.union([z.number(), z.string()])).optional().default([]),
    location: z.string().nullable().optional().default(null),
    budget: z.string().nullable().optional().default(null),
    bedrooms: z.array(z.string()).optional().default([]),
    investmentType: z.array(z.string()).optional().default([]),
    types: z.array(z.string()).optional().default([]),
});
