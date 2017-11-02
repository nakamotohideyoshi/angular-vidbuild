import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }
  public scrollToServices(): void {
      const element = document.querySelector("#services");
      console.log(element)
      element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
