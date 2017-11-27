import { Component, ElementRef, EventEmitter, Input, QueryList, OnDestroy, Output, ViewChildren } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import { VidTextClipComponent } from '../vid-clip/vid-text-clip/vid-text-clip.component';
import { VidVideoClipComponent } from '../vid-clip/vid-video-clip/vid-video-clip.component';
import { PosChangeEvent } from '../../../core/directives/draggable.directive';
import { WidthChangeEvent } from '../../../core/directives/resizable.directive';
import { vbuild } from '../../../core/model/classes';


@Component({
  selector: 'vid-timeline',
  templateUrl: './vid-timeline.component.html',
  styleUrls: ['./vid-timeline.component.scss']
})
export class VidTimelineComponent implements OnDestroy {

  @Input() public project: vbuild.Project;
  @Output() public clipChange: EventEmitter<OpenShot.Clip> = new EventEmitter();
  @ViewChildren(VidTextClipComponent) private textClips: QueryList<VidVideoClipComponent>;
  @ViewChildren(VidVideoClipComponent) private videoClips: QueryList<VidVideoClipComponent>;

  private clipChange$: Subject<OpenShot.Clip> = new Subject();
  private clipsIdStack: number[] = [];
  private subs: Subscription;
  private readonly osRequestDebounceTime = 2500;  // msec

  constructor() {
    this.subs = this.clipChange$
    .do(clip => this.saveDistinctClipId(clip.id))
    .debounceTime(this.osRequestDebounceTime)
    .subscribe(clip => this.emitChangedClips());
  }

  public onPosChange(evt: PosChangeEvent, type: string): void {
    if (type === 'video') {
      this.videoClips.toArray()[evt.index].setPosition(evt.x);
      this.clipChange$.next(this.project.videoClips[evt.index]);
    }
  }

  public onWidthChange(evt: WidthChangeEvent, type: string): void {
    if (type === 'video') {
      const prevWidth = this.project.videoClips[evt.index].duration() * 100 / this.project.duration;
      const deltaWidth = evt.width - prevWidth;
      if (evt.resizer === 'left') {
        this.videoClips.toArray()[evt.index].setStart(deltaWidth);
        this.videoClips.toArray()[evt.index].setPosition(evt.x);
      }
      if (evt.resizer === 'right') this.videoClips.toArray()[evt.index].setEnd(deltaWidth);
      this.clipChange$.next(this.project.videoClips[evt.index]);
    }
  }

  public onRemoveTextClip(index: number) {
    this.project.textClips.splice(index, 1);
  }

  public onRemoveVideoClip(index: number) {
    this.project.videoClips.splice(index, 1);
  }

  public renderChildren(): void {
    this.videoClips.forEach(videoClip => videoClip.render());
    this.textClips.forEach(textClip => textClip.render());
  }

  private emitChangedClips(): void {
    let i: number;
    for (const id of this.clipsIdStack) {
      if ((i = this.project.videoClips.findIndex(vClips => vClips.id === id)) !== -1)
        this.clipChange.emit(this.project.videoClips[i]);
      // if (this.textClips[id] !== undefined) this.clipChange.emit(this.textClips[id]);
    }
    this.clipsIdStack = [];
  }

  private saveDistinctClipId(clipId: number): void {
    if (this.clipsIdStack.indexOf(clipId) === -1) this.clipsIdStack.push(clipId);
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
