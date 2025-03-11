import { IPartner } from "./IPartner";

export interface PartnersResponse {
    data: IPartner[];
    metaData: {
        itemsCount: number
        pageCount: number
        pageNumber: number
        pageSize: number
    };
}