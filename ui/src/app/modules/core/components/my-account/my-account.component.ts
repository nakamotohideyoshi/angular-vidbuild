import { Component, OnInit } from '@angular/core';
import { PaymentService } from './../../../payment/services/payment.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from './../../../auth/providers/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  accountDetails: FormGroup;
  handler: any;
  coinsAmount: string;
  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };

  constructor(public paymentService: PaymentService,
              public AuthService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.configHandler();
    
  }

  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://goo.gl/EJJYq8',
      email: this.AuthService.currentUser.email,
      locale: 'auto',
      token: token => {
        this.paymentService.processCoinsPayment(token, this.coinsAmount);
      }
    });
  }

  openHandler(name, description, price, coins) {
    this.coinsAmount = coins;
    this.handler.open({
      name: name,
      description: description,
      amount: price
    });
  }

  updateSubscription(plan){
    this.paymentService.updateSubscription(plan);
  }

  payWithCoins(coins){
    this.paymentService.payWithCoins(coins);
  }

  signup(): void {
    // this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
  }
  saveAccountDetails(): void {
    console.log('saveAccountDetails');
    // this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
  }
  buildForm(): void {
    this.accountDetails = this.formBuilder.group({
      'text': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(4),
        Validators.maxLength(25)
        ]
      ],
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
    });

    this.accountDetails.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }
  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.accountDetails) { return; }
    const form = this.accountDetails;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
