import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import { LayoutModule } from './modules/layout/layout.module';
import { CoreModule } from './core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { debug, metaReducers } from './reducers';
import { LibraryHeaderComponent } from './modules/library/components/library-header/library-header.component';
import { LibraryListComponent } from './modules/library/components/library-list/library-list.component';
import { LibraryListItemComponent } from './modules/library/components/library-list-item/library-list-item.component';
import { LibraryFiltersComponent } from './modules/library/components/library-filters/library-filters.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard, SubscriptionGuard } from './modules/auth/guards/auth.guard';
import {moviesReducer} from './modules/shared/store/movies.reducer';
import {MoviesEffects} from './modules/shared/store/movies.effects';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LibraryHeaderComponent,
    LibraryListComponent,
    LibraryListItemComponent,
    LibraryFiltersComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    HttpModule,
    HttpClientModule,
    AuthModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(debug, { metaReducers }),
    StoreModule.forRoot({ movies: moviesReducer }),

    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Retains last 25 states
    }),
    StoreRouterConnectingModule,
    EffectsModule.forRoot([MoviesEffects]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    SharedModule,
    NgbModule.forRoot()
  ],
  exports: [
    HttpModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuard, SubscriptionGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
