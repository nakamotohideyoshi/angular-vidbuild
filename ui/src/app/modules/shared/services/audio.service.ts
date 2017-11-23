import { GetAudios, SortAudios } from '../store/audios/audios.actions';
import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/providers/auth.service';

import {Store} from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
//import * as CryptoJS from 'crypto-js';


@Injectable()
export class AudioService {
  private_key = 'LC5kUXrHjFx8djxa1Xfy700WeHLYiemMpFMHngkV8eLhH6xBcs0AKPQCDqtqHNS3';
  api_key = 'p0QltE6gCkv0TdTtlOilmrMDo66EcJtAHllmrnEjINTq8j60Qlb7qdWzfKCfOy8u';
  resource = '/api/v1/stock-items/search/';
  audioBlocksUrl = environment.audioblocks.baseUrl + this.resource;

  constructor(
    private http: Http, 
    private store: Store<any>,
    public auth: AuthService
  ) {
    
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.auth.token);
    headers.append('Content-Type', 'application/json');
  }

  public searchAudios(params) {
    console.log('auth . tokennnnnnnn');
    console.log(this.auth.token);
      if (this.auth.token) {
        console.log('auth . tokennnnnnnn 2222');
    console.log(this.auth.token);
        let requestOptions = new RequestOptions();
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        const url = 'https://us-central1-vidbuild-61b8e.cloudfunctions.net/getAudioFromStoryBlocks?keywords=animals&page=1';
        return this.http.get(url, {headers: headers})
      }
  }


  audios() {
    return this.store.select('audios').map(values => values.audios);
  }

  loadAudios(from: number, size: number) {
    this.store.dispatch(new GetAudios(from, size));
  }

  total() {
    return this.store.select('audios').map(values => values.total);
  }

  sort(field: string) {
    this.store.dispatch(new SortAudios(field));
  }

}
