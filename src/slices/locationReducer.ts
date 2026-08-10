import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import {LOCATION_LOGIN} from "../data/constants.ts";


interface LocationStore {
  location: string
}

const initialState: LocationStore = {
  location: LOCATION_LOGIN,
}

const navigateImplementation = (state: LocationStore, action: PayloadAction<string>) => {
  state.location = action.payload
};

export const locationReducer = createSlice({
  name: 'store',
  initialState,
  reducers: {
    navigate: navigateImplementation
  },
})

export const {
  navigate,
} = locationReducer.actions

const reducer = locationReducer.reducer

export default reducer
