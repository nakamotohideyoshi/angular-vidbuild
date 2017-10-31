import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { environment } from "../../../../environments/environment";

@Injectable()
export class GettyService {

  constructor(private http: Http) {}

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Api-Key', 'pj3ke3sdtqseuf2wqmpszqft ');
    headers.append('Content-Type', 'application/json');
  }

  public searchVideos(params) {
    const url = `${environment.getty.baseUrl}v3/search/videos?phrase=${params}`;
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

}
