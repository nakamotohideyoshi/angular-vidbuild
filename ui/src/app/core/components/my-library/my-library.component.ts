import {Component, OnDestroy, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {GettyService} from '../../../modules/shared/services/getty.service';
import {MultiSearchSerivice} from '../../../modules/shared/services/multi-search.service';
import {MultiSearchFilter} from '../../../modules/shared/pipes/multi-search-filter.pipe';
import {EditorService} from '../../../modules/editor/services/editor.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss'],
  providers: [
    MultiSearchSerivice,
    MultiSearchFilter
  ]
})

export class MyLibraryComponent implements OnInit, OnDestroy {
  list: any = [];
  post$: Observable<Array<any>>;
  finished = false;
  sum = 5;
  total = 0;
  columns: String = 'container-img col-sm-6 col-md-3 col-lg-3';
  searchItem: String = '';
  itemList: any = [];

  constructor(private gettyService: GettyService,
              public editorService: EditorService,
              private http: HttpClient,
              private multiSearchService: MultiSearchSerivice,
              private filterPipe: MultiSearchFilter ) {
  }

  ngOnInit() {
    this.gettyService.searchVideos('futbol argentina').subscribe((res: any) => {
      this.list = JSON.parse(res._body).videos;
    });

    this.gettyService.loadMovies(0, 10);
    this.post$ = this.gettyService.movies();
    this.gettyService.total().subscribe((total) => {
    this.total = total;
    this.bindList();
    });
  }

  ngOnDestroy(): void {}

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
  }

  on4Columns() {
    this.columns = 'container-img col-sm-6 col-md-3 col-lg-3';
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
