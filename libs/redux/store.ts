import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import supplierReducer from "./features/suppliers/suppliersSlice";

const rootReducer = combineReducers({
  supplier: supplierReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;
