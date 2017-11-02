import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GettyService } from './../../../modules/shared/services/getty.service';
import { EditorService } from './../../../modules/editor/services/editor.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit {
  list: any = [];

  constructor(
    private gettyService: GettyService,
    public editorService: EditorService
  ) { }

  ngOnInit() {
    this.gettyService.searchVideos('futbol argentina').subscribe((res: any)=>{
      this.list = JSON.parse(res._body).videos;
    })
  }

}
