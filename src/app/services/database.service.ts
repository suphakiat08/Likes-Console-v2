import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: Http
  ) { }

  get(url) {
    let headers = this.getHeader();
    return this.http.get(url, headers)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  post(url, params) {
    let headers = this.getHeader();
    return this.http.post(url, params, headers)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  put(url, id, params) {
    let headers = this.getHeader();
    return this.http.put(url + '/' + id, params, headers)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  putAll(url, params) {
    let headers = this.getHeader();
    return this.http.put(url, params, headers)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  delete(url, id) {
    let headers = this.getHeader();
    return this.http.delete(url + '/' + id, headers)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  async login(url, data) {
    await this.post(url, data).then(res => {
      if (res.token && res.display_name) {
        localStorage.setItem('user', res.display_name);
        localStorage.setItem('token', res.token);
      }
    });
    return;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return;
  }

  getToken(str) {
    return localStorage.getItem(str);
  }

  private getHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', localStorage.getItem('token'));
    return new RequestOptions({ headers: headers });
  }

  private handleError(error) {
    let errMsg = (error.message) ? error.message :
      error.status ? error.status + '-' + error.statusText : 'Server error';
  }
}