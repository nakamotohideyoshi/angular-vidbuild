import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './../core/components/home/home.component';
import { ComponentMapComponent } from './../core/components/component-map/component-map.component';
import { SettingsComponent } from './../core/components/settings/settings.component';
import { LegalComponent } from './../layout/components/legal/legal.component';
import { DashboardComponent } from './../layout/components/dashboard/dashboard.component';
import { PricingComponent } from './../payment/components/pricing/pricing.component';
import { MyAccountComponent } from './../core/components/my-account/my-account.component';
import { UserLoginComponent } from './../auth/components/user-login/user-login.component';
import { CallbackComponent } from './../auth/components/callback/callback.component';
import { VideoListComponent } from './../video-list/video-list/video-list.component';
import { AuthGuard } from './../auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'component-map', component: ComponentMapComponent },
  { path: 'video-list', loadChildren: './../video-list/video-list.module#VideoListModule' },
  { path: 'callback', component: CallbackComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'legal', component: LegalComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'pricing', loadChildren: './../payment/payment.module#PaymentModule'},
  { path: 'editor', loadChildren: './../editor/editor.module#EditorModule'},
  { path: 'backoffice', loadChildren: './../backoffice/backoffice.module#BackofficeModule' },
  { path: '**', component: HomeComponent },
];
