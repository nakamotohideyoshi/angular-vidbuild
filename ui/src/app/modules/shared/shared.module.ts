import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpModule, XHRBackend, RequestOptions} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GettyService} from './services/getty.service';
import {EditorService} from '../editor/services/editor.service';
import {MultiSearchComponent} from './components/multi-search/multi-search.component';
import {MultiSearchSerivice} from './services/multi-search.service';
import {MultiSearchFilter} from './pipes/multi-search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    NgbModule,
    MultiSearchComponent,
    MultiSearchFilter
  ],
  providers: [
    GettyService, EditorService, MultiSearchSerivice
  ],
  declarations: [
    MultiSearchComponent,
    MultiSearchFilter
  ]
})
export class SharedModule {
}
