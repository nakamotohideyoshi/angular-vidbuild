import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';

@Component({
  selector: 'app-add-audios',
  templateUrl: './add-audios.component.html',
  styleUrls: ['./add-audios.component.scss']
})
export class AddAudiosComponent implements OnInit {

  constructor(
    public editorService: EditorService
  ) { }

  ngOnInit() {
  }

}
