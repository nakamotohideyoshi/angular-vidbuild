import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AfService } from "../../providers/af.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private firebaseService: AfService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      console.log(params)
      //this.firebaseService.signInWithCustomToken(params.)
    })
  }

  ngOnInit() {
    console.log('callback component');
  }

}
