import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faCog, faAsterisk, faAngleLeft, faAngleRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo';
  faCog = faCog;
  faAsterisk = faAsterisk;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faFilePdf = faFilePdf;
  url = '';

  constructor(private router: Router) {
    
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  titleFromURL() {
    switch(this.url) {
      case '/linreg': return 'Lineáris regresszió';
      case '/perceptron': return 'Perceptron';
      case '/logreg': return 'Logisztikus regresszió';
    }
    return '';
  }

}
