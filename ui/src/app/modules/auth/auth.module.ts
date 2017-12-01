import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfService } from './providers/af.service';
import { AuthService } from './providers/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { HttpModule } from '@angular/http';

import { reducers } from './reducers';

import { SharedModule } from './../shared/shared.module'; 
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { Modal } from './components/modal/modal.component';
import { CallbackComponent } from './components/callback/callback.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpModule,
    StoreModule.forFeature('Auth', reducers) 
  ],
  exports: [],
  declarations: [UserFormComponent, UserLoginComponent, CallbackComponent, Modal],
  providers: [AfService, AuthService]
})
export class AuthModule { }