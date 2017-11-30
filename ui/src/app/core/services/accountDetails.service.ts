import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ObservableInput } from 'rxjs/Observable';
import { AuthService } from './../../modules/auth/providers/auth.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class AccountDetailsService {

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public AuthService: AuthService
  ) { 

  }

  updateAccountDetails(userInfromation) {
      console.log('userInfromation service: ', userInfromation)
      this.db.object(`users/${this.AuthService.authState.uid}`)
       .update( userInfromation );
    // userInformation {name: name, name: lastname, name: email, }  
  }
  

}
