import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GettyService } from '../../../shared/services/getty.service';
import { EditorService } from './../../services/editor.service';

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.scss']
})
export class AddVideosComponent implements OnInit {

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

  addVideo(type, file){
    this.editorService.addFile(type, file)
    .then((result)=>{
      console.log(result)
    })
  }

}
