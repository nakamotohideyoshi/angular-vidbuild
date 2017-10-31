import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GettyService } from '../../../shared/services/getty.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  list: any;

  constructor(
    private gettyService: GettyService
  ) { }

  ngOnInit() {
    this.gettyService.searchVideos('futbol argentina').subscribe((res: any)=>{
      this.list = JSON.parse(res._body).videos
    })
  }

}
