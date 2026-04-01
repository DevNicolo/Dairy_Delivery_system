import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  getDati(): Observable<any> {
    const options = {
      url: 'http://192.168.90.115:8069/api/get_all_products',
      headers: { 
      'Content-Type': 'application/json',
      // SOSTITUISCI 'TUO_TOKEN_QUI' con il token reale
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnsidWlkIjo4LCJhdXRoX21ldGhvZCI6InBhc3N3b3JkIiwibWZhIjoiZGVmYXVsdCJ9LCJleHAiOjE3NzUwNDc2NzksImlhdCI6MTc3NTA0MDQ3OX0.8YG_MxaHoHUHssxsuvqqIP8FVsIwEA0t_JzgfsJ3QlM' 
    },
      // Odoo JSON-RPC richiede un metodo POST con questo body
      data: {
        jsonrpc: "2.0",
        method: "call",
        params: {},
        id: 1
      }
    };

    // Usiamo CapacitorHttp per saltare i blocchi CORS del browser
    return from(CapacitorHttp.post(options)).pipe(
      map((response: HttpResponse) => response.data)
    );
  }
}