import { createSlice } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";

const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
};

export const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {},
});
