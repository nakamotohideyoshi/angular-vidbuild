import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd , ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public isLegalPage = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        const pageURL = event.url.substring(1,6);
        if(pageURL === 'legal'){
          this.isLegalPage = true;
        } else { this.isLegalPage = false;}
      }
    });
  }

  ngAfterViewInit() {
    if(this.isLegalPage){
      this.onAnchorClick();
    }
  }

  public onAnchorClick(): void {
    this.route.fragment.subscribe ( fragment => {
      const element = document.querySelector( "#" + fragment );
      element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    });
  }




}
