import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../auth/providers/auth.service';

import { AuthActions } from './../../../auth/actions';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  auth$: Observable<any>;
  authSubcription: Subscription;
  authData: any;
  navToggle: String = '';
  navActive: String = '';

  constructor(
    private store: Store<any>,
    public authService: AuthService
  ) {
    this.auth$ = store.select('Auth');
    this.auth$.subscribe((data) => {
      this.authData = data;
    })
  }

  ngOnInit() {
    //this.checkSession();
  }

  login(){
    this.authService.googleLogin();
  }

  logout() {
    this.authService.signOut();
    this.store.dispatch(new AuthActions.LogoutAction());
  }
  toggleNav() {
    if (this.navToggle !== '') {
      this.navToggle = '';
      this.navActive = '';
    } else {
      this.navToggle = 'toggled';
      this.navActive = 'active';
    }
  }


  // checkSession() {
  //   this.authService.authState.subscribe((data) => {
  //     if (data) {
  //       this.store.dispatch(new AuthActions.LoginSuccessAction(data));
  //     }
  //   });
  // }

}
