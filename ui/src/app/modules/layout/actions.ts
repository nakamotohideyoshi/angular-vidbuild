import { Action } from '@ngrx/store';
import { type } from '../../utils';

//Layout MODULE ACTIONS
export const LayoutActionTypes = {
    OPEN_MODAL: type('[Layout] Open Modal'),
    CLOSE_MODAL: type('[Layout] Close Modal'),
};

export class OpenModal implements Action {
    type = LayoutActionTypes.OPEN_MODAL;

    constructor() { }
}

export class CloseModal implements Action {
    type = LayoutActionTypes.CLOSE_MODAL;

    constructor() { }
}

export const LayoutActions = {
    TYPES: LayoutActionTypes,
    OpenModal,
    CloseModal
};

interface Actions {
    collection: {
        TYPES: typeof LayoutActionTypes,
        OpenModal: typeof OpenModal,
        CloseModal: typeof CloseModal
    };
}