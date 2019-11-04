 import {
     CONVERT_CURRENCY,
     CONNECTION_CHANGED,
     CONVERT_CURRENCIES 
 } from './actions.js';
 
 const INITIAL_STATE = {
     connection: 'online'
 }

 export const reducer = (state = INITIAL_STATE, action) => {
     switch(action.type) {
         case CONNECTION_CHANGED:
             return {
                 state,
                 ...{
                    connection: action.status,
                    showConnectionNotification: action.showNotification
                 }
             }; 
         default: 
            return state;
     }
 };