import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPartner } from "../interfaces/IPartner";
import { PartnersResponse } from "../interfaces/IPartnersResponse";

const BASE_URL = 'http://localhost:5004'

export const partnerAPI = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/v1/` }),
    tagTypes: ['Partner'],
    endpoints: (build) => ({
        getAllPartners: build.query<PartnersResponse, number>({
            query: (size: number = 10, number: number = 1) => ({
                url: 'partners',
                params: {
                    pageSize: size,
                    pageNumber: number
                }
            }),
            providesTags: () => ['Partner']
        }),
        createPartner: build.mutation<IPartner, IPartner>({
            query: (partner) => ({
                url: 'partners',
                method: 'POST',
                body: partner
            }),
            invalidatesTags: ['Partner']
        }),
        updatePartner: build.mutation<IPartner, IPartner>({
            query: (partner) => ({
                url: `partners/${partner.id}`,
                method: 'PUT',
                body: partner
            }),
            invalidatesTags: ['Partner']
        }),
        deletePartner: build.mutation<IPartner, IPartner>({
            query: (partner) => ({
                url: `partners/${partner.id}`,
                method: 'DELETE',
                body: partner
            }),
            invalidatesTags: ['Partner']
        })
    })
})