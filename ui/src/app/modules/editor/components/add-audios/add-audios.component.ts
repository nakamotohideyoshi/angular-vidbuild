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
  isBlockView: String = 'active';
  isListView: String = '';
  intervalId: any;
  // progress = '0%';
  previousIndex = 0;
  audioElement: HTMLAudioElement;
  htmlElement: HTMLElement;
  cursorPointer = 0;
  tempTime = 0;

  constructor(
    public editorService: EditorService,
    private audioService: AudioService,
    public multiSearchService: MultiSearchSerivice
  ) { }

  ngOnInit() {
    // this.audioService.searchAudios(this.params).subscribe((res: any)=>{
    //   this.list = JSON.parse(res._body).info;
    //   console.log(this.editorService.currentProject);
    // });
    this.audioService.loadAudios(0, 30);
    this.post$ = this.audioService.audios();
    // console.log(this.post$);
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
    this.playInit();
  }

  on4Columns() {
    // this.columns = 'container-img col-sm-6 col-md-3 col-lg-3';
    this.columns2 = '';
    this.columns4 = 'active';
    this.isBlockView = 'active';
    this.isListView = '';
    this.playInit();
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
    this.playInit();
    this.previousIndex = i;
    if (this.isListView === 'active') {
      document.getElementById('playicon' + i).classList.remove('active');
      document.getElementById('pauseicon' + i).classList.add('active');
    }
    this.getAudioElement(i);
    this.audioElement.play()
    .then(_ => {
      console.log('playing...');
    })
    .catch(e => {
      console.log('loading...');
    });
    this.audioElement.currentTime = this.tempTime;
    this.intervalId = setInterval(() => {
      if (this.isBlockView === 'active') {
        const rect = (document.getElementById('id' + i)).getBoundingClientRect();
        this.cursorPointer = Math.floor((rect.right - rect.left) * this.audioElement.currentTime / this.audioElement.duration);
      } else {
        document.getElementById('pointer' + i).classList.add('active');
        const rect = (document.getElementById('waveform' + i)).getBoundingClientRect();
        this.cursorPointer = Math.floor((rect.right - rect.left) * this.audioElement.currentTime / this.audioElement.duration);
      }
      if (this.audioElement.ended) {
        this.audioLoad(i);
      }
    }, 100);
  }

  audioLoad(i) {
    if (this.isListView === 'active') {
      document.getElementById('playicon' + i).classList.add('active');
      document.getElementById('pauseicon' + i).classList.remove('active');
      document.getElementById('pointer' + i).classList.remove('active');
    }
    this.getAudioElement(i);
    this.audioElement.load();
    clearInterval(this.intervalId);
  }

  playInit() {
    if (this.audioElement) {
      this.audioLoad(this.previousIndex);
    }
  }

  blockOnClick($event, i) {
    this.htmlElement = document.getElementById('id' + i);
    const rect = this.htmlElement.getBoundingClientRect();
    this.getAudioElement(i);
    this.tempTime = this.audioElement.duration * ($event.clientX - rect.left) / (rect.right - rect.left);
    this.audioElement.currentTime = this.tempTime;
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    }
  }

  listOnClick($event, i) {
    this.htmlElement = document.getElementById('waveform' + i);
    const rect = this.htmlElement.getBoundingClientRect();
    this.getAudioElement(i);
    this.tempTime = this.audioElement.duration * ($event.clientX - rect.left) / (rect.right - rect.left);
    this.audioElement.currentTime = this.tempTime;
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    }
  }

  displayCursor(i) {
    this.tempTime = 0;
    this.getAudioElement(i);
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    }
  }

  hideCursor(i) {
    this.getAudioElement(i);
    if (this.audioElement.played.length !== 0) {
      this.audioLoad(i);
    }
    this.tempTime = 0;
  }

  displayfCursor(i) {
    document.getElementById('fpointer' + i).classList.add('active');
    this.getAudioElement(i);
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    }
  }
  hidefCursor(i) {
    document.getElementById('fpointer' + i).classList.remove('active');
    this.getAudioElement(i);
    if (this.audioElement.played.length !== 0) {
      this.audioLoad(i);
    }
    this.tempTime = 0;
  }

  getAudioElement(i) {
    this.audioElement = document.getElementById('audio' + i) as HTMLAudioElement;
  }

}
