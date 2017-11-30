import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PaymentService } from '../../../modules/payment/services/payment.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../modules/auth/providers/auth.service';
import { AccountDetailsService } from '../../services/accountDetails.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  accountDetails: FormGroup;
  handler: any;
  creditsAmount: string;
  priceCurrentPlan: string;
  hideErrors: boolean = true;
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
              public accountDetailesService : AccountDetailsService;
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.configHandler();
    this.formatCurrentPricePlan();
    
  }

  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://goo.gl/EJJYq8',
      email: this.AuthService.currentUser.email,
      locale: 'auto',
      token: token => {
        this.paymentService.processCoinsPayment(token, this.creditsAmount);
      }
    });
  }

  openHandler(name, description, price, coins) {
    this.creditsAmount = coins;
    this.handler.open({
      name: name,
      description: description,
      amount: price,
      tax_percent: 20
    });
  }
  clearPlan (){
    this.paymentService.clearPlan();
  }
  updateSubscription(plan){
    this.paymentService.updateSubscription(plan);
  }

  payWithCoins(credits){
    this.paymentService.payWithCoins(credits);
  }

  signup(): void {
    // this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
  }
  saveAccountDetails(): void {
    console.log('saveAccountDetails');
    // if (this.accountDetails.valid) {
      let userInformation = { 
        name: this.accountDetails.value.name,
        lastname: this.accountDetails.value.lastname,
        businessname: this.accountDetails.value.businessname,
        email: this.accountDetails.value.email,
        address: this.accountDetails.value.address,
      }
      this.accountDetailesService.updateAccountDetails(userInformation);
    // } else {
    //   this.hideErrors =  false;
    // }
    
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
      'name': [this.AuthService.authState.name || '', [
        Validators.minLength(4),
        Validators.maxLength(25)
        ]
      ],
      'lastname': [this.AuthService.authState.lastname || '', [
        Validators.minLength(4),
        Validators.maxLength(25)
        ]
      ],
      'businessname': [this.AuthService.authState.businessname || '', [
        Validators.minLength(4),
        Validators.maxLength(25)
        ]
      ],
      'email': [this.AuthService.authState.email, [
        Validators.required,
        Validators.email
        ]
      ],
      'address': [this.AuthService.authState.address || '', [
        Validators.minLength(4),
        Validators.maxLength(25)
        ]
      ],
    });

    this.accountDetails.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }
  // buildForm(): void {
  //   this.accountDetails = this.formBuilder.group({
  //     'text': ['', [
  //       Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
  //       Validators.minLength(4),
  //       Validators.maxLength(25)
  //       ]
  //     ],
  //     'email': ['', [
  //       Validators.required,
  //       Validators.email
  //     ]
  //     ],
  //   });

  //   this.accountDetails.valueChanges.subscribe(data => this.onValueChanged(data));
  //   this.onValueChanged(); // reset validation messages
  // }

  formatCurrentPricePlan(){
    const priceDB = this.paymentService.myplan.priceWithVat;
    console.log(priceDB);
    this.priceCurrentPlan = priceDB.toString();
    this.priceCurrentPlan = this.priceCurrentPlan.slice(0, -2);
  }
  
  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    console.log('onValueChangeddd')
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
