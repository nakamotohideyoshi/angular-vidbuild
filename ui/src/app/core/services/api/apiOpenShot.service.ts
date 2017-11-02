import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiOpenShotService {

  private readonly formatJson = '/?format=json';
  private hostname;
  private hostnameProxy;  // to remove when proxy is removed

  constructor(private http: Http) {
    this.hostnameProxy = `${environment.BASE_OPENSHOT_URL}`;
    this.hostname = `${environment.BASE_OPENSHOT_PROXY}`;
   }

   getProjects() {
     const headers: Headers = new Headers();
     // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
     const options: RequestOptionsArgs = { headers };
     const resource = 'projects';
     const url = `${this.hostname}/${resource}${this.formatJson}`;
     return this.http.get(url, options)
     .map((res: Response) => res.json())
     .catch((error: any) => Observable.throw(error));
   }

  public createClip(clip: OpenShot.Clip) {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'clips';
    const url = `${this.hostname}/${resource}${this.formatJson}`;
    clip.file = `${this.hostnameProxy}/files/${clip.file}/`;
    clip.project = `${this.hostnameProxy}/projects/${clip.project}/`;
    return this.http.post(url, clip, options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error));
  }

  public createEffect(effect: OpenShot.Effect) {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'effects';
    const url = `${this.hostname}/${resource}${this.formatJson}`;
    effect.project = `${this.hostnameProxy}/projects/${effect.project}/`;
    return this.http.post(url, effect, options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error));
  }

  public createProject(project: OpenShot.Project) {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'projects';
    const url = `${this.hostname}/${resource}${this.formatJson}`;
    return this.http.post(url, project, options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error));
  }

  public editClip() {
    /** @todo To implement */
  }

  public editEffect() {
    /** @todo To implement */
  }

  public editProject(project: OpenShot.Project) {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'projects';
    const url = `${this.hostname}/${resource}/${project.id}${this.formatJson}`;
    return this.http.put(url, project, options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error));
  }

  public export(exportConfig: OpenShot.Export): Observable<OpenShot.Export> {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'exports';
    const url = `${this.hostname}/${resource}${this.formatJson}`;
    exportConfig.project = `${this.hostnameProxy}/projects/${exportConfig.project}/`;
    return this.http.post(url, exportConfig, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error));
  }

  public getExport(id: number): Observable<OpenShot.Export> {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    const options: RequestOptionsArgs = { headers };
    const resource = 'exports';
    const url = `${this.hostname}/${resource}/${id}${this.formatJson}`;
    return this.http.get(url, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error));
  }

  public getFile(url: string): Observable<Blob> {
    url = url.replace(this.hostnameProxy, this.hostname);
    const options: RequestOptionsArgs = { responseType: ResponseContentType.ArrayBuffer };
    return this.http.get(url, options)
      .map((res: Response) => res.arrayBuffer())
      .catch((error: any) => Observable.throw(error));
  }

  public isProjectValid() {
    /** @todo To implement */
  }

  public UploadFile(file: OpenShot.RawFile) {
    const headers: Headers = new Headers();
    // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
    headers.append('Content-type', 'multipart/form-data');
    const options: RequestOptionsArgs = { headers };
    const resource = 'files';
    const url = `${this.hostname}/${resource}${this.formatJson}`;
    const formData: FormData = new FormData();
    formData.append('media', file.media, file.media.name);
    formData.append('project', `${this.hostnameProxy}/projects/${file.project}/`);
    formData.append('json', JSON.stringify(file.json));

    return this.http.post(url, formData)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error));
  }

}
