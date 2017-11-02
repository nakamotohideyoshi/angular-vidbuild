import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
@Component({
  selector: 'app-add-voiceover',
  templateUrl: './add-voiceover.component.html',
  styleUrls: ['./add-voiceover.component.scss']
})
export class AddVoiceoverComponent implements OnInit {

  constructor(
    public editorService: EditorService
  ) { }

  ngOnInit() {
  }

}
