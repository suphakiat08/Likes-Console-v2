import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private user: any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.getPage();
  }

  getPage() {
    if (!this.user) {
      this.router.navigateByUrl('login');
    }
  }
}
