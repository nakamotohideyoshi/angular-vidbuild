import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { editorRouting } from './routes';

import { VidEditorModule } from './../vid-editor/vidEditor.module';

import { AddVideosComponent } from './components/add-videos/add-videos.component';
import { AddAudiosComponent } from './components/add-audios/add-audios.component';
import { AddVoiceoverComponent } from './components/add-voiceover/add-voiceover.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportComponent } from './components/export/export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from './../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    editorRouting,
    FormsModule,
    InfiniteScrollModule,
    SharedModule,
    VidEditorModule
  ],
  declarations: [
    AddVideosComponent,
    AddAudiosComponent,
    AddVoiceoverComponent,
    EditComponent,
    ExportComponent
  ],
  providers:[]
})
export class EditorModule { }
