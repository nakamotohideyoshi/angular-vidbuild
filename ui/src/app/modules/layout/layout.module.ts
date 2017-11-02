import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RoutingModule } from './../routing/routing.module';

import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthModule } from './../../modules/auth/auth.module';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ModalComponent } from './components/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { LegalComponent } from './components/legal/legal.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    RouterModule,
    AuthModule,
    SharedModule
  ],
  providers:[],
  exports: [BaseLayoutComponent],
  declarations: [HeaderComponent, BaseLayoutComponent, FooterComponent, SidebarComponent, ModalComponent, LegalComponent]
})
export class LayoutModule { }
