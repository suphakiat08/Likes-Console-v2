import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent {

  constructor(
    private router: Router
  ) { }

  background(url) {
    if (this.router.url == url) {
      return { "background-color": "rgb(230, 230, 230)" };
    } else {
      return;
    }
  }
}
