import { GetAudios, AudiosGathered, GET, SORT, SortAudios, AudiosSorted } from './audios.actions';
import { environment } from '../../../../../environments/environment';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';
import { AuthService } from '../../../auth/providers/auth.service';

@Injectable()
export class AudiosEffects {
  @Effect() get$ = this.actions$
    .ofType(GET)
    .flatMap((action: GetAudios) => {
      return this.getExternalData(action.params, action.from, action.size)
        .map(({ info, totalSearchResults }) => {
          return { audios: info, total: totalSearchResults };
        })
        .map(({ audios, total }) => new AudiosGathered(audios, total));
    });

  // @Effect() sort$ = this.actions$
  //   .ofType(SORT)
  //   .flatMap((action: SortAudios) => {
  //     return this.getExternalData()
  //       .map(({ info, totalSearchResults }) => {
  //         return new AudiosSorted(this.simulateSort(info, action.field));
  //       });
  //   });

  constructor(private http: Http, private actions$: Actions, public auth: AuthService) { }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +  this.auth.token);
    headers.append('Content-Type', 'application/json');
  }

  getExternalData(params: String, from: number, size: number) {
    // return this.http.get('assets/audios.json').map(response => response.json());
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = 'https://us-central1-vidbuild-61b8e.cloudfunctions.net/getAudioFromStoryBlocks/getAudioFromStoryBlocks?keywords='
    + params
    + '&page='
    + from
    + '&num_results='
    + size;
    return this.http.get(url, {headers: headers})
    .map(response => response.json());
  }

  simulatePagination(data: any[], from: number, size: number) {
    return data.slice(from, from + size);
  }

  simulateSort(data: any[], field) {
    return _.sortBy(data, [field]);
  }
}
