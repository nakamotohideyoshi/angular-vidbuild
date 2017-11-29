import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DraggableDirective } from '../../core/directives/draggable.directive';
import { ResizableDirective } from '../../core/directives/resizable.directive';
import { VidEditorComponent } from './vid-editor/vid-editor.component';
import { VidPlayerComponent } from './vid-player/vid-player.component';
import { VidSvgEditorComponent } from './vid-svg-editor/vid-svg-editor.component';
import { VidSvgTextBoxComponent } from './vid-svg-text-box/vid-svg-text-box.component';
import { VidTimelineComponent } from './vid-timeline/vid-timeline.component';
import { VidAudioClipComponent } from './vid-clip/vid-audio-clip/vid-audio-clip.component';
import { VidTextClipComponent } from './vid-clip/vid-text-clip/vid-text-clip.component';
import { VidVideoClipComponent } from './vid-clip/vid-video-clip/vid-video-clip.component';
import { VidVoiceClipComponent } from './vid-clip/vid-voice-clip/vid-voice-clip.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [ CommonModule, FormsModule, NgbModule, SharedModule ],
  providers: [],
  declarations: [
    DraggableDirective,
    ResizableDirective,
    VidPlayerComponent,
    VidSvgEditorComponent,
    VidSvgTextBoxComponent,
    VidTimelineComponent,
    VidAudioClipComponent,
    VidEditorComponent,
    VidTextClipComponent,
    VidVideoClipComponent,
    VidVoiceClipComponent
  ],
  exports: [
    VidPlayerComponent,
    VidSvgEditorComponent,
    VidSvgTextBoxComponent,
    VidTimelineComponent,
    VidEditorComponent,
    VidAudioClipComponent,
    VidTextClipComponent,
    VidVideoClipComponent,
    VidVoiceClipComponent
  ]
})
export class VidEditorModule { }
