import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import FSStorage from 'redux-persist-fs-storage';
import brandInfoReducer from './BrandInfoSlice';
import deviceUuidReducer from './DeviceUuidSlice';
import subscriberInformationReducer from './SubscriberInformationSlice';

const persistConfig = {
  key: 'root',
  keyPrefix: '', // the redux-persist default is `persist:` which doesn't work with some file systems
  blacklist: [],
  storage: FSStorage(),
};

const rootReducer = combineReducers({
  brandInfo: brandInfoReducer,
  deviceUuid: deviceUuidReducer,
  subscriberInformation: subscriberInformationReducer,
});

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
