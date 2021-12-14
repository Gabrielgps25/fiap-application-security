import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { AUTH_CONFIG } from '../auth/auth0-variables';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(public authHttp: AuthHttp) { }

  getAllUsers() {
    return this.authHttp.get(AUTH_CONFIG.apiUrl + '/users')
      .map(res => res.json())
  }
}
