import { inject, Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';
import { OrderService } from './order';

const endpoint = '/get_available_products';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  public vehicle_id: string | undefined;
  private userToken = this.authService.getToken();

  constructor() {}  

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  getProducts(): Observable<any> {
    // need to get vehicle_id from orderService before making the API call
    return this.orderService.getDailyVehicle().pipe(
      switchMap(res => {
        const options = {
          url: `${environment.baseUrl}${endpoint}`,
          headers: { 
            'Content-Type': `${environment.type}`,
            'Authorization': `${environment.odooToken}${this.userToken}` 
          },
          data: {
            jsonrpc: `${environment.jsonrpc}`,
            method: `${environment.method}`,
            params: { vehicle_id: res.result.vehicle_id }, 
            id: `${environment.id}`
          }
        };
        
        return this.response(options);
      })
    );
  }
}