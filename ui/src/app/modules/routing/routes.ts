import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../../core/components/home/home.component';
import { ComponentMapComponent } from '../../core/components/component-map/component-map.component';
import { SettingsComponent } from '../../core/components/settings/settings.component';
import { LegalComponent } from './../layout/components/legal/legal.component';
import { PricingComponent } from './../payment/components/pricing/pricing.component';
import { MyAccountComponent } from '../../core/components/my-account/my-account.component';
import { MyLibraryComponent } from '../../core/components/my-library/my-library.component';
import { UserLoginComponent } from './../auth/components/user-login/user-login.component';
import { CallbackComponent } from './../auth/components/callback/callback.component';
import { AuthGuard, SubscriptionGuard } from './../auth/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'component-map', component: ComponentMapComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'legal', component: LegalComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'library', component: MyLibraryComponent },
  { path: 'account', component: MyAccountComponent, canActivate: [AuthGuard, SubscriptionGuard] },
  { path: 'pricing', loadChildren: './../payment/payment.module#PaymentModule'},
  { path: 'editor', loadChildren: './../editor/editor.module#EditorModule', canActivate: [AuthGuard]},
  { path: '**', component: HomeComponent },
];
