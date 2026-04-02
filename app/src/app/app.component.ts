import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { clipboardOutline, personOutline, cubeOutline, logOutOutline } from 'ionicons/icons';

import { AuthService } from './services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {

  public appPages = [
    { title: 'I miei ordini', url: '/home/orders', icon: 'clipboard-outline' },
    { title: 'Il mio magazzino', url: '/home/warehouse', icon: 'cube-outline' },
    { title: 'Il mio profilo', url: '/home/profile', icon: 'person-outline' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() {
    addIcons({ clipboardOutline, personOutline, cubeOutline, logOutOutline });
  }

  private authService = inject(AuthService);  
  private Router = inject(Router);
  
  logout() {
    this.authService.clearToken();
    this.Router.navigate(['/login']);
  }
}
