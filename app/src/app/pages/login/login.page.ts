import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonList, IonItem } from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonList, IonItem, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
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
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

}
