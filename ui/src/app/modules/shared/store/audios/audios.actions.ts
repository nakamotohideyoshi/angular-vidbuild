import { Action } from '@ngrx/store';

export const GET = '[AUDIOS] GET';
export const GATHERED = '[AUDIOS] GATHERED';
export const SORT = '[AUDIOS] SORT';
export const SORTED = '[AUDIOS] SORTED';
export class GetAudios implements Action {
  readonly type = GET;
  constructor(public params: String, public from: number, public size: number) { }
}

export class AudiosGathered implements Action {
  readonly type = GATHERED;
  constructor(public values: any[], public total: number) { }
}

export class SortAudios implements Action {
  readonly type = SORT;
  constructor(public field: string) { }
}

export class AudiosSorted implements Action {
  readonly type = SORTED;
  constructor(public values: any[]) { }
}

export type AudioActions = GetAudios | AudiosGathered | SortAudios | AudiosSorted;
