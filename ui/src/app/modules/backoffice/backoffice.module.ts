import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoPanelComponent } from './components/bo-panel/bo-panel.component';
import { RouterModule } from '@angular/router';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './../shared/shared.module';

import {
  BOReducer
} from './reducers';

import { backofficeRouting } from './routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    backofficeRouting,
    StoreModule.forFeature('Bo', BOReducer)
  ],
    declarations: [BoPanelComponent]
})
export class BackofficeModule { }
