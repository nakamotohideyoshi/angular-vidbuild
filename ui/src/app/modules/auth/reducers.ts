// // auth.reducer.ts
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { AuthActionTypes } from './actions';
import { authState } from './state';

export const reducers: ActionReducerMap<any> = authReducer;


export function authReducer(state: any = authState, action: any): any {
    //console.log(action.type, action.payload, AuthActions.LoginSuccessAction)
    switch (action.type) {
        case AuthActionTypes.LOGIN_SUCCESS: {
           return { ...state, user: action.payload }
        }

        case AuthActionTypes.LOGOUT: {
            return { ...state, user: {} }
        };

        default: {
            return state;
        }
    }
}