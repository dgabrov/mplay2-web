import {configureStore} from '@reduxjs/toolkit'
import mediaReducer from './slices/mediaReducer.ts'
import {useDispatch, useSelector} from "react-redux";
import locationReducer from "./slices/locationReducer.ts";

export const store = configureStore({
    reducer: {
        media: mediaReducer,
        location: locationReducer,
    },
})

// Add these two lines at the bottom:
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
