import { Action } from '@ngrx/store';

export const GET = '[MOVIES] GET';
export const GATHERED = '[MOVIES] GATHERED';
export const SORT = '[MOVIES] SORT';
export const SORTED = '[MOVIES] SORTED';
export class GetMovies implements Action {
  readonly type = GET;
  constructor(public params: String, public from: number, public size: number) { }
}

export class MoviesGathered implements Action {
  readonly type = GATHERED;
  constructor(public values: any[], public total: number) { }
}

export class SortMovies implements Action {
  readonly type = SORT;
  constructor(public field: string) { }
}

export class MoviesSorted implements Action {
  readonly type = SORTED;
  constructor(public values: any[]) { }
}

export type MovieActions = GetMovies | MoviesGathered | SortMovies | MoviesSorted;
