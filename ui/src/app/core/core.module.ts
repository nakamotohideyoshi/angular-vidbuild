import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../modules/shared/shared.module';
import { CoreComponent } from './components/core/core.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyLibraryComponent } from './components/my-library/my-library.component';
import { UserComponent } from './components/user/user.component';
import { PaymentService } from '../modules/payment/services/payment.service';
import { ComponentMapComponent } from './components/component-map/component-map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {Ng2SearchPipeModule} from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    InfiniteScrollModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    HomeComponent,
    SettingsComponent,
    CoreComponent,
    UserComponent,
    MyAccountComponent,
    MyLibraryComponent,
    ComponentMapComponent,
  ],
  providers: [
    PaymentService
  ]

})
export class CoreModule { }
