import { Component, OnInit } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';
import { MyCookieService } from '../../services/cookie.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  now = Date.now();
  users: {
    name: String,
    token: String,
    expire: number
  }

  constructor(
    public facebook: FacebookService,
    public cookie: MyCookieService,
    private service: DatabaseService,
  ) { }

  ngOnInit() {
    this.initUsers(
      this.cookie.getCookie("name"),
      this.cookie.getCookie("token"),
      this.cookie.getCookie("expire")
    );
    let interval = setInterval(
      () => {
        if (this.now) {
          this.now = Date.now();
        } else {
          clearInterval(interval);
          this.now = null;
        }
      }, 1000
    );
  }

  initUsers(name, token, expire) {
    this.users = {
      name: name,
      token: token,
      expire: expire
    }
  }

  async generate() {
    let user;
    await this.facebook.signInWithFB()
      .then((res: any) => {
        user = res;
      });

    await this.facebook.getExpireFB(user.token)
      .then(res => {
        user.expire = new Date(res.data.expires_at).getTime() * 1000;
      });

    this.cookie.deleteCookie();
    this.cookie.setCookie('name', user.name);
    this.cookie.setCookie('token', user.token);
    this.cookie.setCookie('expire', user.expire);
    this.initUsers(user.name, user.token, user.expire);

    this.putToken(
      user.token
    );
  }

  clear() {
    this.facebook.signOut();
    this.cookie.deleteCookie();
    this.initUsers(null, null, null);
  }

  putToken(token) {
    this.service.putAll(
      'https://localhost:3000/token',
      {
        token: this.users.token,
        expire: this.users.expire
      }
    );
  }
}