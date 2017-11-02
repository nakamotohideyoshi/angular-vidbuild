import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service'
@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  constructor(
    public editorService: EditorService
  ) {}

  ngOnInit() {
  }

  build(type){
    console.log(type);
    this.editorService.build(type);
  }
}
