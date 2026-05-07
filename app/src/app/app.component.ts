import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, 
         IonRouterOutlet, IonRouterLink, IonFooter, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { clipboardOutline, personOutline, cubeOutline, logOutOutline } from 'ionicons/icons';

import { AuthService } from './services/auth';
import { Router } from '@angular/router';
import { UserService } from './services/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, 
            IonList, IonMenuToggle, IonItem, IonIcon, IonLabel,
            IonRouterLink, IonRouterOutlet, IonFooter, IonHeader, IonToolbar],
})
export class AppComponent {

  private router = inject(Router);
  public userService = inject(UserService);  // Inject UserService to access the user's display name

  public appPages = [
    { title: 'I miei ordini', url: '/home/orders', icon: 'clipboard-outline' },
    { title: 'Il mio magazzino', url: '/home/warehouse', icon: 'cube-outline' },
    { title: 'Il mio profilo', url: '/home/profile', icon: 'person-outline' },
  ];

  constructor() {
    addIcons({ clipboardOutline, personOutline, cubeOutline, logOutOutline });
  }

  private authService = inject(AuthService);  
  
  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
