import { inject, Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';

const endpoint_products = '/get_all_orders';
const endpoint_vehicle = '/get_daily_vehicle';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private authService = inject(AuthService);
  private userToken = this.authService.getToken();

  constructor() {}

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  getProducts(): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_products}`,

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

  getProductById(id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_products}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          order_id: id
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }

  getDailyVehicle(): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_vehicle}`,

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