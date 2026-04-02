import { inject, Injectable, signal } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';

const endpointUserInfo = '/get_user_info';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private authService = inject(AuthService);

  userDisplayName = signal<string>('');   // Signal to hold the user's display name

  private response(options: any){
    return from(CapacitorHttp.post(options)).pipe(map(res => res.data));
  }

  getUserInfo() {
    const token = this.authService.getToken();

    const options = {
      url: `${environment.baseUrl}${endpointUserInfo}`,
      headers: {
        'Content-Type': `${environment.type}`,
        'Authorization': `Bearer ${token}`
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
