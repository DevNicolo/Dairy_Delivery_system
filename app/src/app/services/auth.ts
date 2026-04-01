import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = '/jwt/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {}

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data.result));
  }

  login(username: string, password: string): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endpoint}`,

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
}
