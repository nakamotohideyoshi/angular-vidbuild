import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(
    public editorService: EditorService
  ) { }

  ngOnInit() {
  }

  build(type) {
    console.log(type);
    this.editorService.build(type);
  }

}
