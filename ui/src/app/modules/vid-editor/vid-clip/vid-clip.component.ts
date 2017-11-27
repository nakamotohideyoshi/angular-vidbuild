import { EventEmitter, Input, Output } from '@angular/core';

import { vbuild } from '../../../core/model/classes';

export abstract class VidClipComponent {

  @Input() public clip: vbuild.Clip;
  @Output() public removeClip: EventEmitter<undefined> = new EventEmitter();

  constructor() { }

  public onRemoveClip(): void {
    this.removeClip.emit();
  }
}
