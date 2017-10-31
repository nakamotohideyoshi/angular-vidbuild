import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {trigger, state, style, animate, transition,keyframes} from '@angular/animations';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from './../../../auth/providers/auth.service';

@Component({
  selector: 'subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss']
})
export class SubscriptionPaymentComponent implements OnInit {
  handler: any;
  planSelected: string;
  monthly: boolean = true;
  dataPlans: any;
  

  constructor(
    public paymentService: PaymentService,
    public AuthService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.configHandler();
    
  }

  public toggleElement(){
     this.monthly=!this.monthly;
  }


  private configHandler() {

    let options: any = {
      key: environment.stripeKey,
      image: '',
      locale: 'auto',
      token: token => {
        this.paymentService.processSubscriptionPayment( token, this.planSelected );
      }
    };

    if( this.AuthService.authenticated ){
      options.email = this.AuthService.currentUser.email;
    } 
    
    this.handler = StripeCheckout.configure(options);
    this.dataPlans = this.paymentService.getPlansInfo();
    
    console.log('this.paymentService.plans');
    console.log('this.getPlansInfo()');
    console.log(this.paymentService.getPlansInfo());
    console.log(this.paymentService.plans);
  }

  clearPlan() {
    this.paymentService.clearPlan();
  }

  openHandler(name, description, amount, plan) {
    if(!this.AuthService.authenticated){
      this.router.navigate(['/login']);
      return false;
    }
    if (this.paymentService.membership.status === "inactive") {
      this.planSelected = plan;
      this.handler.open({
        name: name,
        description: description,
        amount: amount
      });
    } else {
      alert('Change your plan in user profile page')
    }
  }
}
