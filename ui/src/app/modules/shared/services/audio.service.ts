import { GetAudios, SortAudios } from '../store/audios/audios.actions';
import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';


@Injectable()
export class AudioService {
  // private_key = 'LC5kUXrHjFx8djxa1Xfy700WeHLYiemMpFMHngkV8eLhH6xBcs0AKPQCDqtqHNS3';
  // api_key = 'p0QltE6gCkv0TdTtlOilmrMDo66EcJtAHllmrnEjlNTq8j60Qlb7qdWzfKCfOy8u';
  // resource = '/api/v1/stock-items/search/';
  // videoBlocksUrl = 'https://api.videoblocks.com' + this.resource;

  constructor(private http: Http, private store: Store<any>) { }

  // private createAuthorizationHeader(headers: Headers) {
  //   const unixTimeInSeconds = Math.floor(​ Date.now() / 1000);
  //   console.log(this.private_key.length);
  //   console.log(this.private_key + unixTimeInSeconds);
  //   const encrypted = CryptoJS.SHA256(this.resource, this.private_key + unixTimeInSeconds);
  //   const hex = CryptoJS.enc.Hex.stringify(encrypted);
  //   console.log(encrypted.key);
  //   console.log(this.resource);
  //   console.log(unixTimeInSeconds);
  //   console.log(hex);
  //   // headers.append('EXPIRES', '' + unixTimeInSeconds);
  //   // headers.append('APIKEY', this.api_key);
  //   // headers.append('HMAC', hex);
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   headers.append('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization');
  //   headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //   headers.append('Access-Control-Allow-Credentials', 'true');
  //   headers.append('Content-Type', 'application/json');
  //   this.videoBlocksUrl += '?APIKEY='+ this.api_key+'&HMAC='+hex+'&EXPIRES='+unixTimeInSeconds+'&keywords='+'plane';
  //   console.log(this.videoBlocksUrl);
  // }

  // public searchVideos(params) {
  //   console.log(this.videoBlocksUrl);
  //   const headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   const url = this.videoBlocksUrl;
  //   return this.http.get(url, {
  //     headers: headers
  //   });
  // }


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
