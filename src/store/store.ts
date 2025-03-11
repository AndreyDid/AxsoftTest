import { configureStore } from "@reduxjs/toolkit";
import { partnerAPI } from "../services/PartnerSevice";

export const store = configureStore({
    reducer: {
        [partnerAPI.reducerPath]: partnerAPI.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(partnerAPI.middleware)

})