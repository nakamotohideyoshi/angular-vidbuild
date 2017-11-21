import { Action } from '@ngrx/store';
import { AudioActions, GATHERED, SORTED } from './audios.actions';
export interface AudioState {
  audios: any[];
  total: number;
}
export function audiosReducer(state: AudioState = { audios: [], total: 0 }, action: AudioActions) {
  switch (action.type) {
    case GATHERED:
      return { ...state, total: action.total, audios: state.audios.concat(action.values) };
    case SORTED:
      return { ...state, audios: action.values };
    default:
      return state;
  }
}
