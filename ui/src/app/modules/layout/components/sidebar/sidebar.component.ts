import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isAddVideo: String = '';
  public isAddMusic: String = '';
  public isAddVoice: String = '';
  public isEdit: String = '';
  public isBuild: String = '';

  constructor(private router: Router) {
    this.router.events
    .map(event => event)
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('add-video') !== -1) {
          this.isAddVideo = 'activated';
          this.isAddMusic = '';
          this.isAddVoice = '';
          this.isEdit = '';
          this.isBuild = '';
        } else if (event.url.indexOf('add-audio') !== -1) {
          this.isAddVideo = '';
          this.isAddMusic = 'activated';
          this.isAddVoice = '';
          this.isEdit = '';
          this.isBuild = '';
        } else if (event.url.indexOf('add-voiceover') !== -1) {
          this.isAddVideo = '';
          this.isAddMusic = '';
          this.isAddVoice = 'activated';
          this.isEdit = '';
          this.isBuild = '';
        } else if (event.url.indexOf('edit-ad') !== -1) {
          this.isAddVideo = '';
          this.isAddMusic = '';
          this.isAddVoice = '';
          this.isEdit = 'activated';
          this.isBuild = '';
        } else if (event.url.indexOf('export') !== -1) {
          this.isAddVideo = '';
          this.isAddMusic = '';
          this.isAddVoice = '';
          this.isEdit = '';
          this.isBuild = 'activated';
        } else {
          this.isAddVideo = 'activated';
          this.isAddMusic = '';
          this.isAddVoice = '';
          this.isEdit = '';
          this.isBuild = '';
        }
      }
    });
  }

  ngOnInit() {
  }

}
