import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  private name: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    try {
      let user = JSON.parse(localStorage.getItem('user'));
      this.name = user.display_name.substring(0, 1).toLocaleUpperCase() +
        user.display_name.substring(1, user.display_name.length);
    } catch (e) { }
  }

  background(url) {
    if (this.router.url == url) {
      return { "background-color": "rgb(230, 230, 230)" };
    } else {
      return;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
