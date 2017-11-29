import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

import { vbuild } from '../../../core/model/classes';
import { exportStatus } from '../../../core/model/constants';
import { ApiOpenShotService } from '../../../core/services/api/apiOpenShot.service';
import { VidTimelineComponent } from '../vid-timeline/vid-timeline.component';
import { Text } from '@angular/compiler';

import { EditorService } from '../../editor/services/editor.service';


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
  public videoSrc = '';
  public width: number = 640;
  public height: number = 360;
  public processTime = 0;
  public currFrame: string;

  public effectTypes = ['Blur', 'Brightness', 'ChromaKey', 'Deinterlace', 'Negate', 'Mask', 'Saturation'];

  @ViewChild('timeline') private timeline: VidTimelineComponent;
  private fileToUpload: File = undefined;

  constructor(
    private openShotService: ApiOpenShotService,
    private sanitizer: DomSanitizer,
    private editorService: EditorService
  ) {
    // this.project = new vbuild.Project({
    //   width: this.width,
    //   height: this.height,
    //   videoClips: [
    //     // new vbuild.VideoClip({ position: 0, start: 0, end: 10, fileDuration: 10 }),
    //     // new vbuild.VideoClip({ position: 15, start: 0, end: 12, fileDuration: 12 })
    //   ],
    //   textClips: [
    //     new vbuild.TextClip({ position: 0, start: 0, end: 8 }),
    //     new vbuild.TextClip({ position: 10, start: 0, end: 8 }),
    //     new vbuild.TextClip({ position: 21, start: 0, end: 8 })
    //   ]
    // });
  }

  public onCreateClip(): void {
    const newClip = new vbuild.VideoClip({
      file: this.fileId,
      position: this.timelinePos,
      start: this.clipStartAt,
      end: this.clipEndAt,
      layer: this.layer,
      project: String(this.project.id)
    });

    this.project.videoClips.push(newClip);
    this.openShotService.createClip(newClip).subscribe((res: OpenShot.Clip) => {
      newClip.fileDuration = res.json.reader.duration;
      newClip.id = res.id;
    });
  }

  public onClipChange(clip: OpenShot.Clip): void {
    // this.openShotService.editClip(clip).subscribe(() => console.log('Clip Edited'));
  }

  public onCreateEffect(): void {
  }

  public onDurationChange(duration: number): void {
    this.timeline.renderChildren();
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
      .concat(this.openShotService.exportProject(new vbuild.ExportConfig({ project: String(this.project.id) }))
        .do(result => exportStatus$.next(result)))
      .subscribe();
  }

  public onFrameSeek(seekTime: number): void {
    const frame = this.project.secsToFrame(seekTime);

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

    this.openShotService.exportProject(new vbuild.ExportConfig({
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

  public onFrameSeek_thumb(seekTime: number): void {
    const frameNum = this.project.secsToFrame(seekTime);
    const startTime = Date.now();
    this.openShotService.getFrame(this.project.id, {
      frame_number: frameNum,
      width: 640,
      height: 360,
      image_quality: 100,
      image_format: 'JPG'
    }).do(frameImg => { this.currFrame = frameImg; console.log(this.processTime = (Date.now() - startTime) / 1000); })
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
