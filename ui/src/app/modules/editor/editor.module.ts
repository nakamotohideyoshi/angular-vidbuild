import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { editorRouting } from './routes';
import { AddVideosComponent } from './components/add-videos/add-videos.component';
import { AddAudiosComponent } from './components/add-audios/add-audios.component';
import { AddVoiceoverComponent } from './components/add-voiceover/add-voiceover.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportComponent } from './components/export/export.component';

import { EditorService } from './services/editor.service';

@NgModule({
  imports: [
    CommonModule,
    editorRouting
  ],
  declarations: [
    AddVideosComponent,
    AddAudiosComponent,
    AddVoiceoverComponent,
    EditComponent,
    ExportComponent
  ],
  providers:[
    EditorService
  ]
})
export class EditorModule { }
