// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

const reducer = (state = {}, action) => state;

const store = configureStore({
  reducer,
});

export default store;
