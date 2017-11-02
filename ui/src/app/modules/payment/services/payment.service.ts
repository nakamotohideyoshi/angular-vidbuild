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
  myplan: any = { plan: "", name: "", description: "", stripePrice: 0, credits: 0, storage: 0, frequency: '', price: '' };
  plans: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public AuthService: AuthService
  ) {
    this.afAuth.authState
    .map(authState => !!authState)
    .do(authenticated => {
      if (!authenticated) {
        this.membership = {
          status: 'inactive',
          plan: ''
        };
        this.myplan = { plan: "", name: "", description: "", stripePrice: 0, credits: 0, storage: 0, frequency: '', price: '' };
      } else {
        this.db.object(`users/${this.AuthService.authState.uid}/membership`).valueChanges().subscribe(data => {
          if (data) {
            this.membership = data;
            this.getPlanInfo(this.membership.plan)
          }
        })
      }
    }).subscribe();

    this.getPlansInfo()
  }

  getPlansInfo(){
    this.db.list(`plans`).valueChanges().subscribe(data => {
      if (data) {
        this.plans = data;
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

  get hasSubscription(): boolean {
    if(this.membership.status !== 'inactive'){
      return true;
    } else {
      return false;
    }
  }

}
