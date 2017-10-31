import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AfService {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signInEmail(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(function(error){
      alert('Login Error')
    });
  }

  signUpEmail(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error){
      alert('Sign Up Error')
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
