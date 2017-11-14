import { GetMovies, SortMovies } from '../store/movies.actions';
import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class GettyService {

  constructor(private http: Http, private store: Store<any>) { }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Api-Key', 'pj3ke3sdtqseuf2wqmpszqft ');
    headers.append('Content-Type', 'application/json');
  }

  public searchVideos(params) {
    const url = `${environment.getty.baseUrl}v3/search/videos?phrase=${params}&page_size=100`;
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  //
  movies() {
    return this.store.select('movies').map(values => values.movies);
  }

  loadMovies(params: String, from: number, size: number) {
    this.store.dispatch(new GetMovies(params, from, size));
  }

  total() {
    return this.store.select('movies').map(values => values.total);
  }

  sort(field: string) {
    this.store.dispatch(new SortMovies(field));
  }

}
