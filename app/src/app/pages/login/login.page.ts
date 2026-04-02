import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonList, IonItem, MenuController } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonList, IonItem, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  private sideMenu = inject(MenuController);
  private router = inject(Router);

  ionViewWillEnter() {  // disable the side menu when entering the login page
    this.sideMenu.enable(false);
  }

  ionViewWillLeave() {  // re-enable the side menu when leaving the login page
    this.sideMenu.enable(true);
  }


  username: string = '';
  password: string = '';

  authService = inject(AuthService);
  
  constructor() { }

  ngOnInit() {
  }

  doLogin() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if(response && response.token) {
          this.authService.setToken(response.token);
          this.router.navigate(['/home']);
        } else {
          console.error('Login failed: invalid credentials');
          alert('Credenziali errate. Riprova.');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Si è verificato un errore durante il login. Riprova.');
      }
    });
  }

}
