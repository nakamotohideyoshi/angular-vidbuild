import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPaymentComponent } from './components/subscription-payment/subscription-payment.component';
import { PaymentService } from './services/payment.service';
import { SharedModule } from './../shared/shared.module';
import { paymentRoutingModule } from './routes';
import { PricingComponent } from './components/pricing/pricing.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    paymentRoutingModule
  ],
  providers:[
    PaymentService
  ],
  declarations: [SubscriptionPaymentComponent, PricingComponent]
})
export class PaymentModule { }
