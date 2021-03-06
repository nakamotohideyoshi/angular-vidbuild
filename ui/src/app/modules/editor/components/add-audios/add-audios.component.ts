import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
import { Response } from '@angular/http';
import { AudioService } from '../../../shared/services/audio.service';
import { Observable } from 'rxjs/Observable';
import {MultiSearchSerivice} from './../../../shared/services/multi-search.service';
import { AuthService } from '../../../auth/providers/auth.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-add-audios',
  templateUrl: './add-audios.component.html',
  styleUrls: ['./add-audios.component.scss']
})
export class AddAudiosComponent implements OnInit {

  list: any = [];
  post$: Observable<Array<any>>;
  finished = false;
  sum = 20;
  page = 1;
  total = 0;
  columns: String = 'container-img col-sm-6 col-md-3 col-lg-3';
  searchItem: String = '';
  itemList: any = [];
  columns2: String = '';
  columns4: String = 'active';
  params: String = 'music';
  selectedVidCount = 0;
  isBlockView: String = 'active';
  isListView: String = '';
  intervalId: any;
  progress = '0%';
  previousIndex = 0;
  audioElement: HTMLAudioElement;
  htmlElement: HTMLElement;
  cursorPointer = 0;
  tempTime = 0;
  characters = 0;

  constructor(
    public editorService: EditorService,
    private audioService: AudioService,
    public multiSearchService: MultiSearchSerivice,
    public auth: AuthService
  ) { }

  ngOnInit() {

    this.auth.currentUserObservable.subscribe((auth: any) => {
      firebase.auth().currentUser.getToken()
      .then((val) => {
        this.loadAudio();
      });
    });
  }

  loadAudio() {
    // console.log('loadAudio');
    // this.audioService.searchAudios(this.params).subscribe((res: any)=>{
    //   this.list = JSON.parse(res._body).info;
    //   console.log(this.list);
    // });
    this.audioService.loadAudios(this.params, this.page, this.sum);
    this.post$ = this.audioService.audios();
    this.audioService.total().subscribe((total) => {
    this.total = total;
    });
    this.bindList();
  }


  addVideo(type, file, provider, stockID) {
    this.editorService.addFile(type, file, provider, stockID)
    .then((result) => {
      console.log(result);
    });
  }

  onScroll(event) {
    const start = ++this.page;
    const totalPage =  this.total % this.sum ? (1 + Math.floor(this.total / this.sum)) : Math.floor(this.total / this.sum);
     if ( start < totalPage + 1 ) {
      this.audioService.loadAudios(this.params, this.page, this.sum);
     } else {
       this.finished = true;
     }

  }

  sort(sort) {
    this.audioService.sort(sort);
  }

  on2Columns() {
    this.columns = 'container-img col-xs-12';
    this.columns2 = 'active';
    this.columns4 = '';
    this.isBlockView = '';
    this.isListView = 'active';
    this.playInit();
  }

  on4Columns() {
    this.columns = 'container-img col-sm-6 col-md-3 col-lg-3';
    this.columns2 = '';
    this.columns4 = 'active';
    this.isBlockView = 'active';
    this.isListView = '';
    this.playInit();
  }


  keyEvent(event) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      this.searchItem = this.searchItem.replace(' ', '');
      if (this.searchItem.length > 0) {
        this.onAdd();
      }
    } else if (event.keyCode === 8) {
      this.characters--;
      if (this.characters === -1 && this.multiSearchService.searchItemList.length !== 0) {
        this.multiSearchService.searchItemList.splice(this.multiSearchService.searchItemList.length - 1, 1);
        this.bindList();
      } else if (this.multiSearchService.searchItemList.length === 0) {
        this.characters = 0;
      }
    } else if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.characters++;
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
    this.characters = 0;
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
      document.getElementById('progress' + i).classList.add('active');
    } else {
      document.getElementById('fprogress' + i).classList.add('active');
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
      if (this.audioElement.ended) {
        this.audioLoad(i);
      }
      this.progress = Math.floor( 100 * this.audioElement.currentTime / this.audioElement.duration) + '%';
    }, 100);
  }

  audioLoad(i) {
    if (this.isListView === 'active') {
      document.getElementById('playicon' + i).classList.add('active');
      document.getElementById('pauseicon' + i).classList.remove('active');
      document.getElementById('progress' + i).classList.remove('active');
    } else {
      document.getElementById('fprogress' + i).classList.remove('active');
    }
    this.getAudioElement(i);
    this.audioElement.load();
    clearInterval(this.intervalId);
  }

  playInit() {
    if (this.audioElement) {
      this.audioLoad(this.previousIndex);
    }
    this.progress = '0%';
  }

  blockOnClick($event, i) {
    this.htmlElement = document.getElementById('id' + i);
    const rect = this.htmlElement.getBoundingClientRect();
    this.getAudioElement(i);
    this.tempTime = this.audioElement.duration * ($event.clientX - rect.left) / (rect.right - rect.left);
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    } else {
      this.audioElement.currentTime = this.tempTime;
    }
  }

  listOnClick($event, i) {
    this.htmlElement = document.getElementById('waveform' + i);
    const rect = this.htmlElement.getBoundingClientRect();
    this.getAudioElement(i);
    this.tempTime = this.audioElement.duration * ($event.clientX - rect.left) / (rect.right - rect.left);
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    } else {
      this.audioElement.currentTime = this.tempTime;
    }
  }

  displayCursor(i) {
    document.getElementById('pointer' + i).classList.add('active');
  }

  moveCursor($event, i) {
    const rect = (document.getElementById('waveform' + i)).getBoundingClientRect();
    this.cursorPointer = $event.clientX - rect.left;
  }


  hideCursor(i) {
    document.getElementById('pointer' + i).classList.remove('active');
  }

  onClickPlay(i) {
    this.tempTime = 0;
    this.audioPlay(i);
  }
  onClickPause(i) {
    this.tempTime = 0;
    this.audioLoad(i);
  }

  displayfCursor(i) {
    document.getElementById('fpointer' + i).classList.add('active');
    this.getAudioElement(i);
    if (this.audioElement.played.length === 0) {
      this.audioPlay(i);
    }
  }

  movefCursor($event, i) {
    const rect = (document.getElementById('id' + i)).getBoundingClientRect();
    this.cursorPointer = $event.clientX - rect.left;
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
