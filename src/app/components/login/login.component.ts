import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private hide = true;
  private mainGroup: any;
  private invalid = false;

  constructor(
    private service: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigateByUrl('/device');
    }
    this.mainGroup = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  async login() {
    if (this.mainGroup.valid) {
      let hash = sha256.hmac.create('%^&$#^&');
      hash.update(this.mainGroup.value.password);
      this.mainGroup.value.password = hash.hex();

      await this.service.login(
        'https://localhost:3000/login',
        this.mainGroup.value
      );

      if (localStorage.getItem('user')) {
        this.router.navigateByUrl('/device');
      } else {
        this.invalid = true;
      }
    }
    return false;
  }

  matcher = new MyErrorStateMatcher();

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}