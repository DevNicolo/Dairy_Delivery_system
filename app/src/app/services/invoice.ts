import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { CapacitorHttp } from '@capacitor/core';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const endpoint_create = '/post_create_invoice';
const endpoint_get = '/get_invoice_id';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private authService = inject(AuthService);
  private userToken = this.authService.getToken();
  
  constructor() {}

  private response(options: any) {
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  createInvoice(order_id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_create}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          order_id: order_id
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }

  getInvoiceId(order_id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_get}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          order_id: order_id
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }
}
