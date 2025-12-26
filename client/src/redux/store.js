import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userslice"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist:['user']
}

const persistedReducer = persistReducer(persistConfig,userReducer )


 const store = configureStore({
  reducer: {
      user:persistedReducer
  },
   middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
        serializableCheck:false
    })
});
export default store
export const persistor=persistStore(store)