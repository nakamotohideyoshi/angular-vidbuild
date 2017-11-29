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
  sum = 50;
  page= 1;
  total = 0;
  columns: String = 'container-img col-sm-3 col-md-3 col-lg-3';
  searchItem: String = '';
  itemList: any = [];
  columns2: String = '';
  columns4: String = 'active';
  params: String = 'futbol argentina';

  constructor(private gettyService: GettyService,
              public editorService: EditorService,
              private http: HttpClient,
              public multiSearchService: MultiSearchSerivice,
              private filterPipe: MultiSearchFilter ) {
  }

  ngOnInit() {
    // this.gettyService.searchVideos(this.params).subscribe((res: any) => {
    //   this.list = JSON.parse(res._body).videos;
    //   console.log (JSON.parse(res._body).result_count);
    // });
    this.page = 1;

    this.gettyService.loadMovies(this.params, this.page, this.sum);
    this.post$ = this.gettyService.movies();
    this.gettyService.total().subscribe((total) => {
    this.total = total;
    });
    this.bindList();
  }

  ngOnDestroy(): void {}

  onScroll(event) {
    console.log(this.page);
    const start = ++this.page;
    const totalPage =  this.total % this.sum ? (1 + Math.floor(this.total / this.sum)) : Math.floor(this.total / this.sum);
     if ( start < totalPage + 1 ) {
       this.gettyService.loadMovies(this.params, start, this.sum);
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
    this.columns = 'container-img col-sm-3 col-md-3 col-lg-3';
    this.columns2 = '';
    this.columns4 = 'active';
  }


  keyEvent(event) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      this.searchItem = this.searchItem.replace(' ', '');
      if (this.searchItem.length > 0) {
        this.onAdd();
      }
    } else if (event.keyCode === 8) {
      if (this.searchItem.length === 0 && this.multiSearchService.searchItemList.length !== 0) {
        this.multiSearchService.searchItemList.splice(this.multiSearchService.searchItemList.length - 1, 1);
        this.bindList();
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
