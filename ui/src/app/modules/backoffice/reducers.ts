import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { BOActionTypes } from './actions';
import {
    BOState,
} from './states';

export const BOReducer: ActionReducerMap<any> = boReducer;

export function boReducer(state: any = BOState, action: any): any {
    switch (action.type) {
        default: {
            return state;
        }
    }
}
