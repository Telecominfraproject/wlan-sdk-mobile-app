import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import FSStorage from 'redux-persist-fs-storage';
import brandInfoReducer from './BrandInfoSlice';
import sessionReducer from './SessionSlice';
import currentAccessPointIdReducer from './CurrentAccessPointIdSlice';
import subscriberInformationReducer from './SubscriberInformationSlice';
import subscriberInformationLoadingReducer from './SubscriberInformationLoadingSlice';
import systemInfoReducer from './SystemInfoSlice';

const persistConfig = {
  key: 'root',
  keyPrefix: '', // the redux-persist default is `persist:` which doesn't work with some file systems
  blacklist: ['currentAccessPointId', 'session', 'subscriberInformation', 'subscriberInformationLoading'], // session and subscriber are not persisted, new token is retrieved via credential storage if needed
  storage: FSStorage(),
};

const rootReducer = combineReducers({
  brandInfo: brandInfoReducer,
  currentAccessPointId: currentAccessPointIdReducer,
  session: sessionReducer,
  subscriberInformation: subscriberInformationReducer,
  subscriberInformationLoading: subscriberInformationLoadingReducer,
  systemInfo: systemInfoReducer,
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
