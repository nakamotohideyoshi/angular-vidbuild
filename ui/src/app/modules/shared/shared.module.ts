import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpModule, XHRBackend, RequestOptions} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GettyService} from './services/getty.service';
import {AudioService} from './services/audio.service';
import {EditorService} from '../editor/services/editor.service';
import {MultiSearchComponent} from './components/multi-search/multi-search.component';
import {MultiSearchSerivice} from './services/multi-search.service';
import {MultiSearchFilter} from './pipes/multi-search-filter.pipe';
import {OrderBy} from './pipes/plan-card-sort.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    NgbModule,
    MultiSearchComponent,
    MultiSearchFilter,
    OrderBy
  ],
  providers: [
    GettyService, AudioService, EditorService, MultiSearchSerivice
  ],
  declarations: [
    MultiSearchComponent,
    MultiSearchFilter,
    OrderBy
  ]
})
export class SharedModule {
}
