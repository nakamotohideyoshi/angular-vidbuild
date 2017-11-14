import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GettyService } from '../../../shared/services/getty.service';
import { EditorService } from './../../services/editor.service';
import { Observable } from 'rxjs/Observable';
import {MultiSearchSerivice} from './../../../shared/services/multi-search.service';

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.scss']
})
export class AddVideosComponent implements OnInit {

  list: any = [];
  post$: Observable<Array<any>>;
  finished = false;
  sum = 5;
  total = 0;
  columns: String = 'container-img col-sm-6 col-md-3 col-lg-3';
  searchItem: String = '';
  itemList: any = [];
  columns2: String = '';
  columns4: String = 'active';


  constructor(
    private gettyService: GettyService,
    public editorService: EditorService,
    public multiSearchService: MultiSearchSerivice
  ) { }

  ngOnInit() {
    this.gettyService.searchVideos('luxury cars').subscribe((res: any)=>{
      this.list = JSON.parse(res._body).videos;
      console.log(this.list);
      console.log(this.editorService.currentProject);
    })
  }

  addVideo(type, file){
    this.editorService.addFile(type, file)
    .then((result)=>{
      console.log(result)
    })
  }

  onScroll(event) {
    const start = this.sum;
    this.sum += 5;
    if (start < this.total) {
      this.gettyService.loadMovies(start, this.sum);
    } else {
      this.finished = true;
    }
  }

  sort(sort) {
    this.gettyService.sort(sort);
  }

  on2Columns() {
    this.columns = 'container-img col-sm-6 col-md-6 col-lg-6';
    this.columns2 = 'active';
    this.columns4 = '';
  }

  on4Columns() {
    this.columns = 'container-img col-sm-6 col-md-3 col-lg-3';
    this.columns2 = '';
    this.columns4 = 'active';
  }


  keyEvent(event) {
    if (event.keyCode === 32) {
      this.searchItem = this.searchItem.replace(' ', '');
      if (this.searchItem.length > 0) {
        this.onAdd();
      }
    }
  }

  onDelete(item) {
    this.multiSearchService.deleteSearchItem(item);
    this.bindList();
  }
  onAdd() {
    this.multiSearchService.addSearchItem(this.searchItem);
    this.bindList();
    this.searchItem = '';
  }

  bindList() {
    for (let index = 0 ; index < 5 ; index++ ) {
      if (this.multiSearchService.searchItemList[index]) {
        this.itemList[index] = this.multiSearchService.searchItemList[index];
      } else {
        this.itemList[index] = '';
      }
    }
  }

}
