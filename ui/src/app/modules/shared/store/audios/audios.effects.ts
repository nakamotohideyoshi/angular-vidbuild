import { GetAudios, AudiosGathered, GET, SORT, SortAudios, AudiosSorted } from './audios.actions';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';

@Injectable()
export class AudiosEffects {
  @Effect() get$ = this.actions$
    .ofType(GET)
    .flatMap((action: GetAudios) => {
      return this.getExternalData()
        .map(({ info, totalSearchResults }) => {
          return { audios: this.simulatePagination(info, action.from, action.size), total: totalSearchResults };
        })
        .map(({ audios, total }) => new AudiosGathered(audios, total));
    });

  @Effect() sort$ = this.actions$
    .ofType(SORT)
    .flatMap((action: SortAudios) => {
      return this.getExternalData()
        .map(({ info, totalSearchResults }) => {
          return new AudiosSorted(this.simulateSort(info, action.field));
        });
    });

  constructor(private http: Http, private actions$: Actions) { }

  getExternalData() {
    return this.http.get('assets/audios.json').map(response => response.json());
  }

  simulatePagination(data: any[], from: number, size: number) {
    return data.slice(from, from + size);
  }

  simulateSort(data: any[], field) {
    return _.sortBy(data, [field]);
  }
}
