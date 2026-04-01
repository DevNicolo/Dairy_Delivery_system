import { inject, Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';

const endpoint = '/get_all_products';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authService = inject(AuthService);
  private userToken = this.authService.getToken();

  constructor() {}

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  getProducts(): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {},
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }
}