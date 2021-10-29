import { configureStore } from '@reduxjs/toolkit';
import brandInfoReducer from './BrandInfoSlice';
import sessionReducer from './SessionSlice';
import systemInfoReducer from './SystemInfoSlice';

export default configureStore({
  reducer: {
    brandInfo: brandInfoReducer,
    session: sessionReducer,
    systemInfo: systemInfoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
