import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpointLogin = '/jwt/login';
const endopointCheckSession = '/api/check_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {}

  private userToken: string | null = null;

  setToken(token: string) {
    this.userToken = token;
  }

  getToken(): string | null {
    return this.userToken;
  }

  isLoggedIn(): boolean {
    if(this.userToken !== null) {
      return true;
    }
    return false;
  }

  clearToken() {
    this.userToken = null;
  }

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  login(username: string, password: string): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endpointLogin}`,

      headers: {
        'Content-Type': `${environment.type}`,
      },

      data: {
        login: username,
        password: password
      }
    };

    return this.response(options);
  }

  checkSession(token: string): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endopointCheckSession}`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { jsonrpc: "2.0", params: {} }
    };
    return from(CapacitorHttp.post(options));
}
}
