import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import FSStorage from 'redux-persist-fs-storage';
import brandInfoReducer from './BrandInfoSlice';
import sessionReducer from './SessionSlice';
import systemInfoReducer from './SystemInfoSlice';

const persistConfig = {
  key: 'root',
  keyPrefix: '', // the redux-persist default is `persist:` which doesn't work with some file systems
  storage: FSStorage(),
};

const persistedBrandInfoReducer = persistReducer(persistConfig, brandInfoReducer);
const persistedSessionReducer = persistReducer(persistConfig, sessionReducer);
const persistedSystemInfoReducer = persistReducer(persistConfig, systemInfoReducer);

const store = configureStore({
  reducer: {
    brandInfo: persistedBrandInfoReducer,
    session: persistedSessionReducer,
    systemInfo: persistedSystemInfoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
