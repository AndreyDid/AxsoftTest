export interface IPartnerUpdateResponceError {
    status: number,
    data: IData
}

interface IData {
    title: string,
    status: number,
    errors: IErrors
}

interface IErrors {
    INN: [string]
}