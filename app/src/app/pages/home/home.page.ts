import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonNote],
})
export class HomePage implements OnInit {
  public home!: string;
  private activatedRoute = inject(ActivatedRoute);

  public apiData: any;
  private apiService = inject(ApiService);
  constructor() {}

  ngOnInit() {
    this.home = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.loadinfo();
  }


    loadinfo() {
      this.apiService.getProducts().subscribe({
      next: (response) => {
        this.apiData = response.result; // Salviamo i dati che arrivano          console.log('Dati ricevuti con successo:', response);
      },
        error: (error) => {
          console.error('Qualcosa è andato storto:', error);
        }
      });
}
}
