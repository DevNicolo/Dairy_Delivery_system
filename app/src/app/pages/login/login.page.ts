import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonList, IonItem } from '@ionic/angular/standalone';

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
  constructor() { }

  ngOnInit() {
  }

  doLogin() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    if(!this.username || !this.password) {
      alert('Inserisci unsername e password.');
    }
  }

}
