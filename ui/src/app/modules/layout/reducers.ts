// // auth.reducer.ts
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { LayoutActionTypes } from './actions';
import { layoutState } from './state';

export const reducers: ActionReducerMap<any> = authReducer;


export function authReducer(state: any = layoutState, action: any): any {
    //console.log(action.type, action.payload, AuthActions.LoginSuccessAction)
    switch (action.type) {
        case LayoutActionTypes.OPEN_MODAL: {
           return { ...state, openModal: true }
        }

        case LayoutActionTypes.CLOSE_MODAL: {
            return { ...state, openModal: false }
        };

        default: {
            return state;
        }
    }
}