import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
import { Response } from '@angular/http';
import { AudioService } from '../../../shared/services/audio.service';
import { Observable } from 'rxjs/Observable';
import {MultiSearchSerivice} from './../../../shared/services/multi-search.service';

@Component({
  selector: 'app-add-audios',
  templateUrl: './add-audios.component.html',
  styleUrls: ['./add-audios.component.scss']
})
export class AddAudiosComponent implements OnInit {

  list: any = [];
  post$: Observable<Array<any>>;
  finished = false;
  sum = 30;
  page = 1;
  total = 0;
  columns: String = 'container-img col-sm-6 col-md-3 col-lg-3';
  searchItem: String = '';
  itemList: any = [];
  columns2: String = '';
  columns4: String = 'active';
  params: String = 'preflight';
  selectedVidCount = 0;
  audioElement: HTMLAudioElement;
  isBlockView: String = 'active';
  isListView: String = '';

  constructor(
    public editorService: EditorService,
    private audioService: AudioService,
    public multiSearchService: MultiSearchSerivice
  ) { }

  ngOnInit() {
    this.audioService.searchAudios(this.params).subscribe((res: any)=>{
      this.list = JSON.parse(res._body).info;
      console.log(this.list);
      console.log(this.editorService.currentProject);
    });
    this.audioService.loadAudios(0, 30);
    this.post$ = this.audioService.audios();
    console.log(this.post$);
    this.audioService.total().subscribe((total) => {
    this.total = total;
    });
    this.bindList();
  }

  addVideo(type, file) {
    this.editorService.addFile(type, file)
    .then((result) => {
      console.log(result);
    });
  }

  onScroll(event) {
    const start = this.sum;
    this.sum += 10;
    if (start < this.total) {
      this.audioService.loadAudios(start, 10);
    } else {
      this.finished = true;
    }

  }

  sort(sort) {
    this.audioService.sort(sort);
  }

  on2Columns() {
    // this.columns = 'container-img col-sm-6 col-md-6 col-lg-6';
    this.columns2 = 'active';
    this.columns4 = '';
    this.isBlockView = '';
    this.isListView = 'active';
  }

  on4Columns() {
    // this.columns = 'container-img col-sm-6 col-md-3 col-lg-3';
    this.columns2 = '';
    this.columns4 = 'active';
    this.isBlockView = 'active';
    this.isListView = '';
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

  countSelectedVid(i) {
    this.selectedVidCount++;
    document.getElementById('id' + i).classList.add('selected');
  }

  disCountSelectedVid(i) {
    this.selectedVidCount--;
    document.getElementById('id' + i).classList.remove('selected');
  }

  audioPlay(i) {
    this.audioElement = document.getElementById('audio' + i) as HTMLAudioElement;
    this.audioElement.play()
    .then(_ => {
      console.log('playing...');
    })
    .catch(e => {
      console.log('loading...');
    });
  }

  audioLoad(i) {
    this.audioElement = document.getElementById('audio' + i) as HTMLAudioElement;
    this.audioElement.pause();
  }

}
