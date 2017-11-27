import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { VidClipComponent } from '../vid-clip.component';
import { vbuild } from '../../../../core/model/classes';

@Component({
  selector: 'vid-video-clip',
  templateUrl: './vid-video-clip.component.html',
  styleUrls: ['./vid-video-clip.component.scss']
})
export class VidVideoClipComponent extends VidClipComponent implements OnInit {

  @Input() public clip: vbuild.VideoClip = new vbuild.VideoClip();
  @Input() public project: vbuild.Project;

  public clipDown: boolean;
  public clipWidth: number;   // %
  public maxDeltaRight: number = 0;
  public maxDeltaLeft: number = 0;
  public posX: number;    // %
  public resizerLeftDown: boolean;
  public resizerRightDown: boolean;

  private mouseUp$: Observable<MouseEvent>;
  private mouseUpSubs: Subscription;

  constructor() {
    super();
    this.mouseUp$ = Observable.fromEvent<MouseEvent>(window, 'mouseup').do(event => this.onMouseUp());
  }

  public ngOnInit(): void {
    this.render();
  }

  public onElementDown(event: Event, elem?: string): void {
    event.stopPropagation();
    this.resizerLeftDown = elem === 'left';
    this.resizerRightDown = elem === 'right';
    this.clipDown = true;
    this.mouseUpSubs = this.mouseUp$.subscribe();
  }

  public onMouseUp(): void {
    this.clipDown = this.resizerLeftDown = this.resizerRightDown = false;
    this.mouseUpSubs.unsubscribe();
  }

  /** Set the Clip position in secs, from X coordinate in % */
  public setPosition(posXPerc: number): void {
    this.clip.position = posXPerc * this.project.duration / 100;
    console.log('Position: ' + this.clip.position);
  }

  /** Set the Clip End in secs, from X coordinate in % */
  public setEnd(deltaWidthPerc: number): void {
    this.maxDeltaRight -= deltaWidthPerc;
    if (this.maxDeltaRight < 0 ) this.maxDeltaRight = 0;
    this.clip.end += deltaWidthPerc * this.project.duration / 100;
    console.log('End: ' + this.clip.end);
  }

  /** Set the Clip Start in secs, from X coordinate in % */
  public setStart(deltaWidthPerc: number): void {
    this.maxDeltaLeft -= deltaWidthPerc;
    if (this.maxDeltaLeft < 0 ) this.maxDeltaLeft = 0;
    this.clip.start -= deltaWidthPerc * this.project.duration / 100;
    console.log('Start: ' + this.clip.start);
  }

  /** Set the component X Position in % accordingly to Clip and Project data */
  public renderPosX(): void {
    this.posX = this.clip.position * 100 / this.project.duration;
  }

  /** Set the component Width in %, accordingly to Clip and Project data */
  public renderWidth(): void {
    this.clipWidth = this.clip.duration() * 100 / this.project.duration;
  }

  public render(): void {
    this.renderPosX();
    this.renderWidth();
  }

}
