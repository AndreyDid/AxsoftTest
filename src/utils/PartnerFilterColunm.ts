import { Partner } from "../conponents/models/Partner"

export const partnerFilterColumn = <T extends Partner>(arr: T[], key: keyof T): { text: string, value: string }[] => {
    if (!arr || arr.length === 0) return []
    const uniqueValues = [...new Set(arr.map(item => String(item[key])))]
    return uniqueValues.map(value => ({
        text: String(value),
        value: String(value)
    }))
}