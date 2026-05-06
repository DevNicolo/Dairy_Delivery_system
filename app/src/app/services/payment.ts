import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { CapacitorHttp } from '@capacitor/core';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const endpoint_confirm = '/post_confirm_payment';
const endpoint_status = '/get_payment_status';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private authService = inject(AuthService);
  private userToken = this.authService.getToken();

  constructor() {}

  private response(options: any) {
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  confirmPayment(invoice_id: number, payment_method: string,amount: number): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endpoint_confirm}`,

      headers: { 
        'Content-Type': `${environment.type}`,
        'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          invoice_id: invoice_id,
          payment_method: payment_method,
          amount: amount
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }

  getPaymentStatus(invoice_id: number): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endpoint_status}`,

      headers: { 
        'Content-Type': `${environment.type}`,
        'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          invoice_id: invoice_id
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }
}
