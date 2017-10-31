import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GettyService } from './services/getty.service';
@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    NgbModule
  ],
  providers: [
    GettyService
  ],
  declarations: []
})
export class SharedModule { }
