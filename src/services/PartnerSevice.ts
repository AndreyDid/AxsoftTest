import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPartnerUpdateResponceError } from "../interfaces/IPartnerUpdateError";
import { MetaData, Partner, PartnersResponseSchema } from "../conponents/models/Partner";

const BASE_URL = 'http://localhost:5000'

export const partnerAPI = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/v1` }),
    tagTypes: ['Partner'],
    endpoints: (build) => ({
        getAllPartners: build.query<{ data: Partner[], metaData: MetaData }, number>({
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
        createPartner: build.mutation<Partner, Omit<Partner, 'id'>>({
            query: (partner) => ({
                url: '/partners',
                method: 'POST',
                body: partner
            }),
            invalidatesTags: ['Partner']
        }),
        updatePartner: build.mutation<Partner, Partner>({
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
        deletePartner: build.mutation<Partner, Partner>({
            query: (partner) => ({
                url: `/partners/${partner.id}`,
                method: 'DELETE',
                body: partner
            }),
            invalidatesTags: ['Partner']
        })
    })
})