import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PricingComponent } from './components/pricing/pricing.component';
import { SubscriptionPaymentComponent } from './components/subscription-payment/subscription-payment.component';

const paymentRoutes: Routes = [
  { path: '', component: PricingComponent }
];

export const paymentRoutingModule: ModuleWithProviders = RouterModule.forChild(paymentRoutes);
