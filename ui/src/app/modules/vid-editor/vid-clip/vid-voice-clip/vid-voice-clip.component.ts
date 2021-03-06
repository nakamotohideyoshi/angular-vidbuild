import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { VidClipComponent } from '../vid-clip.component';
import { vbuild } from '../../../../core/model/classes';

@Component({
  selector: 'vid-voice-clip',
  templateUrl: './vid-voice-clip.component.html',
  styleUrls: ['./vid-voice-clip.component.scss']
})
export class VidVoiceClipComponent extends VidClipComponent {

  @Input() public clip: vbuild.VoiceClip = new vbuild.VoiceClip();

  @Input() public posX: number; // Input temporary (just for testing)
  public clipDown: boolean;
  public resizerLeftDown: boolean;
  public resizerRightDown: boolean;

  private mouseUp$: Observable<MouseEvent>;
  private mouseUpSubs: Subscription;

  constructor() {
    super();
    this.mouseUp$ = Observable.fromEvent<MouseEvent>(window, 'mouseup').do(event => this.onMouseUp());
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

}
