import { GetMovies, MoviesGathered, GET, SORT, SortMovies, MoviesSorted } from './movies.actions';
import { environment } from '../../../../../environments/environment';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';

@Injectable()
export class MoviesEffects {
  @Effect() get$ = this.actions$
    .ofType(GET)
    .flatMap((action: GetMovies) => {
      return this.getExternalData(action.params, action.from, action.size)
        .map(({ videos, result_count }) => {
          return { movies: videos, total: result_count };
        })
        .map(({ movies, total }) => new MoviesGathered(movies, total));
    });

  // @Effect() sort$ = this.actions$
  //   .ofType(SORT)
  //   .flatMap((action: SortMovies) => {
  //     return this.getExternalData()
  //       .map(({ videos, result_count }) => {
  //         return new MoviesSorted(this.simulateSort(videos, action.field));
  //       });
  //   });

  constructor(private http: Http, private actions$: Actions) { }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Api-Key', 'pj3ke3sdtqseuf2wqmpszqft ');
    headers.append('Content-Type', 'application/json');
  }

  getExternalData(params: String, from: number, size: number) {
    console.log(params, from, size);
    // return this.http.get('assets/posts.json').map(response => response.json());
    const url = `${environment.getty.baseUrl}v3/search/videos?phrase=${params}&page=${from}&page_size=${size}`;
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    }).map(response => response.json());
  }

  simulatePagination(params: String, from: number, size: number) {
    // return data.slice(from, from + size);
    const url = `${environment.getty.baseUrl}v3/search/videos?phrase=${params}&page=${from}&page_size=${size}`;
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    }).map(response => response.json());
  }

  simulateSort(data: any[], field) {
    return _.sortBy(data, [field]);
  }
}
