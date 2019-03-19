import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';

import { User } from '../Class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    user_name: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_no: '',
    gender: '',
    birth_date: '',
    role: '',
    city: '',
    state: '',
    password: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth' : 'True' }) };
  constructor(private http: HttpClient) { }

  postUser(user: User) {
    return this.http.post(environment.apiEndPoint + '/registration', user, this.noAuthHeader);
  }


  login(authCredentials) {
    return this.http.post(environment.apiEndPoint + '/authenticate' , authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiEndPoint + '/userProfile');
  }

  getUserProfileById(data) {
    return this.http.get<any>(environment.apiEndPoint.concat('/profileById'), {headers : {'userid' : data, 'NoAuth' : 'True' }});
  }

  sendForgetPasswordCode(data) {
    return this.http.post(environment.apiEndPoint + '/sendMail' , data);
  }

  updatePersonalDetail(user) {
    return this.http.post(environment.apiEndPoint + '/updatePersonalDetail' , user);
  }

  updateCommunicationDetail(user) {
    return this.http.post(environment.apiEndPoint + '/updateCommunicationDetail' , user);
  }

  updatePrivacyDetail(user) {
    return this.http.post(environment.apiEndPoint + '/updatePrivacyDetail' , user);
  }

  makeLoggedInUser(data) {
    return this.http.get<any>(environment.apiEndPoint.concat('/makeLoggedIn'), {headers : {'userid' : data, 'NoAuth' : 'True' }});
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
      const token = this.getToken();
      if (token) {
        const userPayload = atob(token.split('.')[1]);
        return JSON.parse(userPayload);
      } else {
        return null;
      }
    }

  isLoggedIn() {
      const userPayload = this.getUserPayload();
      if (userPayload) {
        if (userPayload.exp > Date.now() / 1000) {
          return true;
        } else {
          this.deleteToken();
          return false;
        }
      }
    }

  isAdminLoggedIn() {
      const userPayload = this.getUserPayload();
      if (userPayload) {
        if (userPayload.role === 'admin') {
          return userPayload.exp > Date.now() / 1000;
        }
        return false;
      }
    }


  }

