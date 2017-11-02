import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VidEditorComponent } from './vid-editor/vid-editor.component';
import { VidPlayerComponent } from './vid-player/vid-player.component';
import { VidTimelineComponent } from './vid-timeline/vid-timeline.component';
import { VidVideoClipComponent } from './vid-clip/vid-video-clip/vid-video-clip.component';

@NgModule({
  imports: [ CommonModule, FormsModule, NgbModule ],
  providers: [],
  declarations: [
    VidPlayerComponent,
    VidTimelineComponent,
    VidEditorComponent,
    VidVideoClipComponent
  ],
  exports: [
    VidPlayerComponent,
    VidTimelineComponent,
    VidEditorComponent,
    VidVideoClipComponent
  ]
})
export class VidEditorModule { }
