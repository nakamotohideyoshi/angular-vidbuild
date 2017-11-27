import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  matchingPasswords } from '../../../shared/validators/validators';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
}) 

export class UserFormComponent  {
  userForm: FormGroup;
  userSignInForm: FormGroup;
  newUser = true; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  formErrors = {
    'name': '',
    'email': '',
    'password': '',
    'mismatchedPasswords': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at least one letter and one number.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.', 
      'mismatchedPasswords': 'Passwords do not match.'
    }
  };

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.userForm = fb.group({
      name: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]]
    }, { validator: matchingPasswords('password', 'confirmPassword') });

    this.userSignInForm = fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [ 
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]],
    });
  }

 

  signup(): void {
    if (!this.userForm.valid) { return; }
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password']);
  }

  login(): void {
    if (!this.userSignInForm.valid) { return; }
    this.auth.emailLogin(this.userSignInForm.value['email'], this.userSignInForm.value['password'])
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true)
  }  

 
}