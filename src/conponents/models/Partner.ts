import { z } from "zod";

const PartnerSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    inn: z.string().min(10).max(12),
    kpp: z.string().min(9).max(9).or(z.literal('')),
    group: z.string(),
    description: z.string().nullable()
});

const MetaDataSchema = z.object({
    itemsCount: z.number(),
    pageCount: z.number(),
    pageNumber: z.number(),
    pageSize: z.number()
})

export const PartnersResponseSchema = z.object({
    data: z.array(PartnerSchema),
    metaData: MetaDataSchema
});

export type Partner = z.infer<typeof PartnerSchema>
export type PartnersResponse = z.infer<typeof PartnersResponseSchema>
export type MetaData = z.infer<typeof MetaDataSchema>