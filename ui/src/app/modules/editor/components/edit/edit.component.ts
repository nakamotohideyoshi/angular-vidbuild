import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  currentClipId: string;
  currentClip: any = {
    fileId: null,
    timelinePos: 0,
    clipStartAt: 0,
    clipEndAt: 10,
    layer: 1
  };

  constructor(
    public editorService: EditorService
  ) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload(){
    this.editorService.uploadResources();
  }

  build(type) {
    this.editorService.build(type);
  }

  onCreateClip() {
    this.editorService.createClip(this.currentClip);
  }

  onUpdateClip(currentClip) {
    this.editorService.updateClip(currentClip);
  }
  
}
