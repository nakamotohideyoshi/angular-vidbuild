import { Action } from '@ngrx/store';
import { type } from '../../utils';

//AUTH MODULE ACTIONS
export const AuthActionTypes = {
    LOGIN: type('[Auth] Login'),
    LOGIN_SUCCESS: type('[Auth] Login Success'),
    LOGIN_FAIL: type('[Auth] Login Fail'),
    LOGOUT: type('[Auth] Logout'),
    LOGOUT_SUCCESS: type('[Auth] Logout Success'),
    LOGOUT_FAIL: type('[Auth] Logout Fail'),
};

/**
 * Login Actions
 */
export class LoginAction implements Action {
    type = AuthActionTypes.LOGIN;

    constructor() { }
}

export class LoginSuccessAction implements Action {
    type = AuthActionTypes.LOGIN_SUCCESS;

    constructor(public payload: any) { }
}

export class LoginFailAction implements Action {
    type = AuthActionTypes.LOGIN_FAIL;

    constructor(public payload: any) { }
}

/**
 * Logout Actions
 */
export class LogoutAction implements Action {
    type = AuthActionTypes.LOGOUT;

    constructor() { }
}

export class LogoutSuccessAction implements Action {
    type = AuthActionTypes.LOGOUT_SUCCESS;

    constructor(public payload: any[]) { }
}

export class LogoutFailAction implements Action {
    type = AuthActionTypes.LOGOUT_FAIL;

    constructor(public payload: any) { }
}

export const AuthActions = {
    TYPES: AuthActionTypes,
    LoginAction,
    LoginSuccessAction,
    LoginFailAction,
    LogoutAction,
    LogoutSuccessAction,
    LogoutFailAction
};


interface AuthActions {
    TYPES: typeof AuthActionTypes,
    LoginAction: typeof LoginAction;
    LoginSuccessAction: typeof LoginSuccessAction;
    LoginFailAction: typeof LoginFailAction;
    LogoutAction: typeof LogoutAction;
    LogoutSuccessAction: typeof LogoutSuccessAction;
    LogoutFailAction: typeof LoginFailAction;
}