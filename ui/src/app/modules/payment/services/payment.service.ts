import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ObservableInput } from 'rxjs/Observable';
import { AuthService } from './../../auth/providers/auth.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class PaymentService {
  userId: string;
  membership: any = {
    status: 'inactive',
    plan: ''
  };
  myplan: any;
  plans: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public AuthService: AuthService
  ) {
    this.AuthService.currentUserObservable.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.db.object(`users/${this.AuthService.authState.uid}/membership`).valueChanges().subscribe(data => {
          if (data) {
            this.membership = data;
            this.getPlanInfo(this.membership.plan)
          }
        })
      }
    })
    this.getPlansInfo()
  }

  getPlansInfo(){
    this.db.list(`plans`).valueChanges().subscribe(data => {
      if (data) {
        this.plans = data;
        console.log('in Payment Service');
        console.log(this.plans);
      }
    })
  }

  getPlanInfo(plan){
    this.db.object(`plans/${plan}`).valueChanges().subscribe(data => {
      if (data) {
        this.myplan = data;
      }
    })
  }

  clearPlan() {
    this.db.object(`users/${this.AuthService.authState.uid}/membership`)
      .update({ status: 'inactive' });
  }

  updateSubscription(update) {
    return this.db.object(`users/${this.AuthService.authState.uid}/membership`)
      .update({ plan: update });
  }

  processSubscriptionPayment(token: any, plan: string) {
    return this.db.object(`users/${this.AuthService.authState.uid}/membership`)
      .update({ token: token.id, plan: plan });
  }

  processCoinsPayment(token: any, amount: string) {
    return this.db.list(`users-purchases/${this.AuthService.authState.uid}/coins`)
      .push({ token: token.id, amount: amount });
  }

  payWithCoins(coins) {
    return this.db.list(`users-purchases/${this.AuthService.authState.uid}/builds`)
      .push({ amount: coins });
  }

  // getSusbcription() {
  //   this.db.object(`users/${this.AuthService.authState.uid}/pro-membership`)
  //   .valueChanges()
  //   .subscribe((data)=>{
  //     console.log(data)
  //     this.membership = data
  //   })
  // }

}
