import { Injectable } from '@angular/core';
import { RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiClient {
  constructor(private http: Http) {}

  request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.http.request(url, options)
      .catch(res => Observable.of(res))
      .flatMap(this.handleResponse);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.get(url, this.noCachingHeaders(options))
      .catch(res => Observable.of(res))
      .flatMap(this.handleResponse);
  }

  post(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http.post(url, body, this.getRequestOptionArgs(options))
      .catch(res => Observable.of(res))
      .flatMap(this.handleResponse);
  }

  put(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http.put(url, body, this.getRequestOptionArgs(options))
      .catch(res => Observable.of(res))
      .flatMap(this.handleResponse);
  }

  delete<T>(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.delete(url, options)
      .catch(res => Observable.of(res))
      .flatMap(this.handleResponse);
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    return options;
  }

  private noCachingHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }

    // prevent caching on IE
    options.headers.append('If-Modified-Since', 'Sat, 26 Jul 1997 05:00:00 GMT');
    // extra
    options.headers.append('Cache-Control', 'no-cache');
    options.headers.append('Pragma', 'no-cache');

    return options;
  }

  private handleResponse(res: Response): Observable<Object> {
    try {
      const parsed = res.json();
      const { success, result } = parsed;
      if (success) {
        return Observable.of(result);
      } else {
        return Observable.throw(result);
      }
    } catch (err) {
      return Observable.throw({ status: res.status });
    }
  }
}