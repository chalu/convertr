import { createStore } from 'redux';
import { reducer } from "./reducer.js";

export const store = createStore(
    reducer
);