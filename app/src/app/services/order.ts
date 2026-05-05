import { inject, Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';

const endpoint_orders = '/get_all_orders';
const endpoint_vehicle = '/get_daily_vehicle';
const endpoint_add_products = '/add_products';
const endpoint_confirm_order = '/post_confirm_order';
const endpoint_delivery_status = '/get_delivery_status';

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

  getAllOrders(): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_orders}`,

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

  getOrderById(id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_orders}`,

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

  addProductsToOrder(order_id: number, products_selection: { [key: number]: number }): Observable<any> {

    // from Hashmap to Array of objects with product_id and quantity
    const productsArray = Object.entries(products_selection)
      .filter(([_, quantity]) => quantity > 0) // only keep products with quantity > 0
      .map(([productId, quantity]) => ({
        product_id: Number(productId),
        quantity: quantity
      }));

    const options = {
      url: `${environment.baseUrl}${endpoint_add_products}`,

      headers: { 
        'Content-Type': `${environment.type}`,
        'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          order_id: order_id,
          products: productsArray
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }

  confirmOrder(order_id: number, vehicle_id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_confirm_order}`,

      headers: { 
      'Content-Type': `${environment.type}`,
      'Authorization': `${environment.odooToken}${this.userToken}` 
      },

      data: {
        jsonrpc: `${environment.jsonrpc}`,
        method: `${environment.method}`,
        params: {
          order_id: order_id,
          vehicle_id: vehicle_id
        },
        id: `${environment.id}`
      }
    };

    return this.response(options);
  }

  getDeliveryStatus(order_id: number): Observable<any> {

    const options = {
      url: `${environment.baseUrl}${endpoint_delivery_status}`,

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