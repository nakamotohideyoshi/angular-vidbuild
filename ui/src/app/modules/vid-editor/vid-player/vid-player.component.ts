import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'vid-player',
  templateUrl: './vid-player.component.html',
  styleUrls: ['./vid-player.component.scss']
})
export class VidPlayerComponent implements OnDestroy, OnInit {

  @Input() public set frameSrc(val: string) {
    this.loading = false;
    this._frameSrc = val;
  }
  @Input() public videoSrc: string;
  @Output() public frameSeek: EventEmitter<number> = new EventEmitter();

  public get frameSrc() { return this._frameSrc; }
  public progressPerc: number = 0;
  public loading: boolean = false;

  private _frameSrc: string;
  private onTimeUpdateSubs: Subscription;
  private videoPlayer: HTMLVideoElement;

  @ViewChild('videoPlayer') private videoHTML5: ElementRef;

  constructor() {  }

  public ngOnInit(): void {
    this.videoPlayer = <HTMLVideoElement>this.videoHTML5.nativeElement;
    this.onTimeUpdateSubs = Observable.fromEvent<Event>(this.videoPlayer, 'timeupdate')
      .subscribe(event => this.onTimeUpdate(event));
    this.videoPlayer.ondurationchange = () => setTimeout(() => undefined); // Temporary
  }

  public playPause(): void {
    this.frameSrc = '';
    this.videoPlayer.paused ? this.videoPlayer.play() : this.videoPlayer.pause();
  }

  public onProgressClick(event: MouseEvent): void {
    this.loading = true;
    let progressBar: HTMLElement = <HTMLElement>event.target;
    if (progressBar.className === 'progress-bar') progressBar = progressBar.parentElement;
    const seekTime = event.offsetX * (this.videoPlayer.duration / progressBar.offsetWidth);
    this.videoPlayer.currentTime = seekTime;
    this.frameSeek.emit(seekTime);
  }

  private onTimeUpdate(event: Event): void {
    const videoPlayer = <HTMLVideoElement>event.target;
    this.progressPerc = this.currentTimePercentage(videoPlayer.currentTime, videoPlayer.duration);
  }

  private currentTimePercentage(currTime: number, duration: number): number {
    return currTime * 100 / duration;
  }

  public ngOnDestroy(): void {
    this.onTimeUpdateSubs.unsubscribe();
  }
}
