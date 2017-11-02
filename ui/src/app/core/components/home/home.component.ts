import { Component, OnInit, HostBinding, HostListener } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
@HostListener('window:resize', ['$event'])
export class HomeComponent implements OnInit {
  public windowHeight: any = 0;

  constructor() { }
  

  ngOnInit() {
    this.windowHeight= window.innerHeight;
  }

  onResize(event) {
    this.windowHeight= event.target.innerHeight;
  }

  public scrollToServices(): void {
      const element = document.querySelector("#services");
      element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
