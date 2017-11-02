import { Component, Input } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';

import { vbuild } from '../../../core/model/classes';
import { exportStatus } from '../../../core/model/constants';
import { ApiOpenShotService } from '../../../core/services/api/apiOpenShot.service';


@Component({
  selector: 'vid-editor',
  templateUrl: './vid-editor.component.html',
  styleUrls: ['./vid-editor.component.scss']
})
export class VidEditorComponent {

  @Input() public project: vbuild.Project;
  public fileId = '';
  public timelinePos: number = undefined;
  public clipStartAt: number = undefined;
  public clipEndAt: number = undefined;
  public effectStartAt: number = undefined;
  public effectEndAt: number = undefined;
  public layer: number = undefined;
  public effectType = 'Mask';
  public effectTitle: string = undefined;
  public rendering = '';
  public renderProgress = 0;
  public videoSrc = 'http://35.176.151.11/media/video/output/20/output-20-92-630826c2.mp4';
  public width: number = 640;
  public height: number = 360;
  public processTime = 0;
  public currFrame: string;

  public effectTypes = ['Blur', 'Brightness', 'ChromaKey', 'Deinterlace', 'Negate', 'Mask', 'Saturation'];

  private fileToUpload: File = undefined;

  constructor(private openShotService: ApiOpenShotService) {
    this.project = new vbuild.Project({
      width: this.width,
      height: this.height
    });
  }

  public onCreateProject(): void {
    this.openShotService.createProject(this.project).subscribe();
  }

  public onGetProjects(): void {
    this.openShotService.getProjects().subscribe();
  }

  public onFileSelected(event: Event): void {
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
    /*const fileReader: FileReader = new FileReader();

    fileReader.onload = (result) => {
      // this.fileToUpload = result.target;
    };
    fileReader.readAsArrayBuffer(file);*/
  }

  public onUploadFile(): void {
    console.log(this.fileToUpload);
    window['fileToUpload'] = this.fileToUpload;
    this.openShotService.UploadFile(<OpenShot.RawFile>{
      media: this.fileToUpload,
      project: String(this.project.id),
      json: {}
    }).subscribe();
  }

  public onCreateClip(): void {
    this.openShotService.createClip(new vbuild.VideoClip({
      file: this.fileId,
      position: this.timelinePos,
      start: this.clipStartAt,
      end: this.clipEndAt,
      layer: this.layer,
      project: String(this.project.id)
    })).subscribe();
  }

  public onCreateEffect(): void {
    this.openShotService.createEffect(<OpenShot.Effect>{
      title: this.effectTitle,
      type: this.effectType,
      position: this.timelinePos,
      start: this.effectStartAt,
      end: this.effectEndAt,
      layer: this.layer,
      project: String(this.project.id),
      json: {}
    }).subscribe();
  }

  public onExportVideo(): void {

    const startTime = Date.now();
    this.processTime = 0;
    this.rendering = 'requested';
    const exportStatus$: Subject<OpenShot.Export> = new Subject();
    exportStatus$
      .mergeMap(exportedResoruce => this.openShotService.getExport(exportedResoruce.id))
      .do(result => {
        this.rendering = result.status;
        this.renderProgress = result.progress; console.log(result.progress);
        if (result.status === exportStatus.inProgress || result.status === exportStatus.pending) exportStatus$.next(result);
        if (result.status === exportStatus.completed) {
          this.videoSrc = result.output;
          exportStatus$.complete();
          this.processTime = (Date.now() - startTime) / 1000;
        }
      }).subscribe();

    this.editProject()
      .concat(this.openShotService.export(new vbuild.ExportConfig({ project: String(this.project.id) }))
        .do(result => exportStatus$.next(result)))
      .subscribe();
  }

  public onFrameSeek(seekTime: number): void {
    const frame = this.project.secsToFrame(seekTime);
    console.log(seekTime, frame);

    /* The following observable must be merged with the Export Method one */
    const startTime = Date.now();
    const exportStatus$: Subject<OpenShot.Export> = new Subject();
    exportStatus$
      .mergeMap(exportedResoruce => this.openShotService.getExport(exportedResoruce.id))
      .do(result => {
        this.rendering = result.status;
        this.renderProgress = result.progress; console.log(result.progress);
        if (result.status === exportStatus.inProgress || result.status === exportStatus.pending) exportStatus$.next(result);
        if (result.status === exportStatus.completed) {
          this.getFile(result.output);
          exportStatus$.complete();
          this.processTime = (Date.now() - startTime) / 1000;
        }
      }).subscribe();

    this.openShotService.export(new vbuild.ExportConfig({
      project: String(this.project.id),
      export_type: 'image',
      video_format: '%05d.jpg',
      video_codec: 'jpg',
      audio_codec: 'n/a',
      audio_bitrate: 0,
      start_frame: frame,
      end_frame: frame
    })).do(result => exportStatus$.next(result))
      .subscribe();
  }

  private getFile(url: string) {
    const imgPrefix = 'data:image/jpg;base64,';
    this.openShotService.getFile(url).subscribe(arrayBuffer => {
      JSZip.loadAsync(arrayBuffer).then(zip => {
        const zipObj = zip.files['00001.jpg'];
        zipObj.async('base64').then(frame => {
          this.currFrame = imgPrefix.concat(frame);
        });
      });
    });
  }

  private editProject() {
    return this.openShotService.editProject(<OpenShot.Project>{
      id: this.project.id,
      width: this.width,
      height: this.height,
      json: {}
    });
  }
}
