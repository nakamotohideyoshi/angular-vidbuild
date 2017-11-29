import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVideosComponent } from './components/add-videos/add-videos.component';
import { AddAudiosComponent } from './components/add-audios/add-audios.component';
import { AddVoiceoverComponent } from './components/add-voiceover/add-voiceover.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportComponent } from './components/export/export.component';

import { AuthGuard, SubscriptionGuard } from './../auth/guards/auth.guard';

const routes: Routes = [
  { path: 'add-videos', component: AddVideosComponent, canActivate: [AuthGuard] },
  { path: 'add-audios', component: AddAudiosComponent, canActivate: [AuthGuard] },
  { path: 'add-voiceover', component: AddVoiceoverComponent, canActivate: [AuthGuard] },
  { path: 'edit-ad', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'export', component: ExportComponent, canActivate: [AuthGuard, SubscriptionGuard] }
];

export const editorRouting: ModuleWithProviders = RouterModule.forChild(routes);
