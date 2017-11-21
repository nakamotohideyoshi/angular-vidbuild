import { GetMovies, MoviesGathered, GET, SORT, SortMovies, MoviesSorted } from './movies.actions';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';

@Injectable()
export class MoviesEffects {
  @Effect() get$ = this.actions$
    .ofType(GET)
    .flatMap((action: GetMovies) => {
      return this.getExternalData()
        .map(({ videos, result_count }) => {
          return { movies: this.simulatePagination(videos, action.from, action.size), total: result_count };
        })
        .map(({ movies, total }) => new MoviesGathered(movies, total));
    });

  @Effect() sort$ = this.actions$
    .ofType(SORT)
    .flatMap((action: SortMovies) => {
      return this.getExternalData()
        .map(({ videos, result_count }) => {
          return new MoviesSorted(this.simulateSort(videos, action.field));
        });
    });

  constructor(private http: Http, private actions$: Actions) { }

  getExternalData() {
    return this.http.get('assets/posts.json').map(response => response.json());
  }

  simulatePagination(data: any[], from: number, size: number) {
    return data.slice(from, from + size);
  }

  simulateSort(data: any[], field) {
    return _.sortBy(data, [field]);
  }
}
