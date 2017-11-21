import { Action } from '@ngrx/store';
import { MovieActions, GATHERED, SORTED } from './movies.actions';
export interface MovieState {
  movies: any[];
  total: number;
}
export function moviesReducer(state: MovieState = { movies: [], total: 0 }, action: MovieActions) {
  switch (action.type) {
    case GATHERED:
      return { ...state, total: action.total, movies: state.movies.concat(action.values) };
    case SORTED:
      return { ...state, movies: action.values };
    default:
      return state;
  }
}
