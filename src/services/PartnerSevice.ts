import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPartnerUpdateResponceError } from "../interfaces/IPartnerUpdateError";
import { z } from "zod";

const BASE_URL = 'http://localhost:5000'

export const PartnerSchema = z.object({
    id: z.string().uuid(), // UUID
    name: z.string(),
    inn: z.string().min(10).max(12),
    kpp: z.string().min(9).max(9).or(z.literal('')),
    group: z.string(),
    description: z.string().nullable()
});

export const MetaDataSchema = z.object({
    itemsCount: z.number(),
    pageCount: z.number(),
    pageNumber: z.number(),
    pageSize: z.number()
})

export const PartnersResponseSchema = z.object({
    data: z.array(PartnerSchema),
    metaData: MetaDataSchema
});

export type IPartner = z.infer<typeof PartnerSchema>
export type IPartnersResponse = z.infer<typeof PartnersResponseSchema>
export type IMetaData = z.infer<typeof MetaDataSchema>

export const partnerAPI = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/v1` }),
    tagTypes: ['Partner'],
    endpoints: (build) => ({
        getAllPartners: build.query<{ data: IPartner[], metaData: IMetaData }, number>({
            query: (size: number = 10, number: number = 1) => ({
                url: '/partners',
                params: {
                    pageSize: size,
                    pageNumber: number
                },
            }),
            transformResponse: (response) => {
                const parsedResponse = PartnersResponseSchema.safeParse(response)
                if (!parsedResponse.success) {
                    console.error("Ошибка валидации данных:", parsedResponse.error.format())
                    throw new Error("Некорректные данные от сервера")
                }
                return {
                    data: parsedResponse.data.data,
                    metaData: parsedResponse.data.metaData
                }
            },
            providesTags: () => ['Partner']
        }),
        createPartner: build.mutation<IPartner, Omit<IPartner, 'id'>>({
            query: (partner) => ({
                url: '/partners',
                method: 'POST',
                body: partner
            }),
            invalidatesTags: ['Partner']
        }),
        updatePartner: build.mutation<IPartner, IPartner>({
            query: (partner) => ({
                url: `/partners/${partner.id}`,
                method: 'PUT',
                body: partner
            }),
            transformErrorResponse: (response: IPartnerUpdateResponceError) => {
                return response.data?.errors?.INN?.[0] ?? "Произошла ошибка"
            },
            invalidatesTags: ['Partner']
        }),
        deletePartner: build.mutation<IPartner, IPartner>({
            query: (partner) => ({
                url: `/partners/${partner.id}`,
                method: 'DELETE',
                body: partner
            }),
            invalidatesTags: ['Partner']
        })
    })
})