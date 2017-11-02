import { Component, Input } from '@angular/core';

import { VidClipComponent } from '../vid-clip.component';
import { vbuild } from '../../../../core/model/classes';

@Component({
  selector: 'vid-video-clip',
  templateUrl: './vid-video-clip.component.html',
  styleUrls: ['./vid-video-clip.component.scss']
})
export class VidVideoClipComponent extends VidClipComponent {

  @Input() public clip: vbuild.VideoClip = new vbuild.VideoClip();

  constructor() {
    super();
  }

}
