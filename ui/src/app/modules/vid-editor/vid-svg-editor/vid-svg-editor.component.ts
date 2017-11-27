import { Component, Input } from '@angular/core';

import { vbuild } from '../../../core/model/classes';

@Component({
  selector: 'vid-svg-editor',
  templateUrl: './vid-svg-editor.component.html',
  styleUrls: ['./vid-svg-editor.component.scss']
})
export class VidSvgEditorComponent {

  @Input() public height: number;
  @Input() public width: number;

  constructor() {  }
}
