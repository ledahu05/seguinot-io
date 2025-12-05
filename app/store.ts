import { configureStore } from '@reduxjs/toolkit';
import { quartoReducer } from './features/quarto/store';

export const store = configureStore({
  reducer: {
    quarto: quartoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
