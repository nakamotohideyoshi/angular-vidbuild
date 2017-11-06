import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {
  public loadLayout: boolean = false;
  public isLoading: boolean = false;
  public loadingContainerClass: string = '';

  constructor(private router: Router) {
    this.router.events
    .map(event => event)
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
        this.loadingContainerClass = 'fadeIn animated';
      }
      if (event instanceof NavigationEnd) {
        setTimeout( () => {
          this.loadingContainerClass = '';
          this.loadingContainerClass = 'fadeOut animated';
          setTimeout( () => {
            this.isLoading = false;
            this.loadingContainerClass = '';
          }, environment.debounceTime);
        }, environment.debounceTime * 2);
      }
    });
  }

  ngOnInit() {
    this.checkSecretPasswordRequired();
  }

   // @TODO: Move to a service
   checkSecretPasswordRequired() {
    if (environment.preventAngularBoostraping) {
      this.getSecretPassword().then((result) => {
        this.validateSecretPassword(result);
      });
    } else {
      this.loadLayout = true;
    }
  }

  // @TODO: Move to a service
  getSecretPassword() {
    let promise = new Promise((res, rej) => {
      let secret = localStorage.getItem('secretPassword');
      if (secret === null) {
        secret = prompt();
      }
      res(secret);
    });

    return promise;
  }

  // @TODO: Move to a service
  validateSecretPassword(password) {
    if (password !== environment.preventAngularBoostrapingPassword) {
      let newPassword = prompt('Tell me a lie');
      this.validateSecretPassword(newPassword);
    } else {
      localStorage.setItem('secretPassword', password);
      this.loadLayout = true;
    }
  }
}
