import { Action } from '@ngrx/store';
import { type } from '../../utils';

// BO MODULE ACTIONS
export const BOActionTypes = {
};

export const TeamsActions = {
    TYPES: BOActionTypes,
};


interface Actions {
    collection: {
        TYPES: typeof BOActionTypes
    };
}
