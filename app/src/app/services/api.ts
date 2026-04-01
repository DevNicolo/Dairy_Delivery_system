// Questo file va fatto per ogni API / gruppo di API, ad esempio tutte le api che fanno operazioni sul magazzino, devono essere nello stesso file
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = '/get_all_products';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  getProducts(): Observable<any> {
    const options = {
      url: `${environment.baseUrl}${endpoint}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}` 
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