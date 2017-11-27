import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { VidClipComponent } from '../vid-clip.component';
import { vbuild } from '../../../../core/model/classes';

@Component({
  selector: 'vid-text-clip',
  templateUrl: './vid-text-clip.component.html',
  styleUrls: ['./vid-text-clip.component.scss']
})
export class VidTextClipComponent extends VidClipComponent implements OnInit {

  @Input() public clip: vbuild.TextClip = new vbuild.TextClip();
  @Input() public project: vbuild.Project;

  public clipDown: boolean;
  public clipWidth: number;   // %
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
