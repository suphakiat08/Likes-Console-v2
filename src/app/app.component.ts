import { Component } from '@angular/core';
import { routerTransition } from './router/animetion';

@Component({
  selector: 'app-root',
  // animations: [routerTransition],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  getPage(outlet) {
    return outlet.activatedRouteData['page'];
  }
}
