import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  name: string;

  constructor(
    private router: Router,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    try {
      let user = localStorage.getItem('user');
      this.name = user.substring(0, 1).toLocaleUpperCase() +
        user.substring(1, user.length);
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
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
