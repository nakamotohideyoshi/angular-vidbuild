import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVideosComponent } from './components/add-videos/add-videos.component';
import { AddAudiosComponent } from './components/add-audios/add-audios.component';
import { AddVoiceoverComponent } from './components/add-voiceover/add-voiceover.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportComponent } from './components/export/export.component';

const routes: Routes = [
  { path: 'add-video', component: AddVideosComponent },
  { path: 'add-audio', component: AddAudiosComponent },
  { path: 'add-voiceover', component: AddVoiceoverComponent },
  { path: 'edit', component: EditComponent },
  { path: 'export', component: ExportComponent }
];

export const editorRouting: ModuleWithProviders = RouterModule.forChild(routes);
