import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GettyService } from './../../shared/services/getty.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  list: any;

  constructor(
    private gettyService: GettyService,
  ) { }

  ngOnInit() {
    this.gettyService.searchVideos('futbol argentina').subscribe((res: any)=>{
      this.list = JSON.parse(res._body).videos
    })
  }

}
