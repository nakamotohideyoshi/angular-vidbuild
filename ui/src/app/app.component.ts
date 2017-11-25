import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(){}

  ngAfterViewInit(){
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }

  
}
