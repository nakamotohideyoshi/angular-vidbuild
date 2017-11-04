import {Component, OnDestroy, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {GettyService} from '../../../modules/shared/services/getty.service';
import {EditorService} from '../../../modules/editor/services/editor.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})

export class MyLibraryComponent implements OnInit, OnDestroy {
  list: any = [];
  post$: Observable<Array<any>>;
  finished = false;
  sum = 5;
  total = 0;

  constructor(private gettyService: GettyService,
              public editorService: EditorService,
              private http: HttpClient ) {
  }

  ngOnInit() {
    this.gettyService.searchVideos('futbol argentina').subscribe((res: any) => {
      this.list = JSON.parse(res._body).videos;
    });

    this.gettyService.loadMovies(0, 10);
    this.post$ = this.gettyService.movies();
    this.gettyService.total().subscribe((total) => {
      this.total = total;
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

}
