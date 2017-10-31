import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service'
@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  constructor(
    private editorService: EditorService
  ) {}

  ngOnInit() {
  }

  addFile(type,url){
    this.editorService.addFile(type, url);
  }

  build(type){
    console.log(type);
    this.editorService.build(type);
  }
}
