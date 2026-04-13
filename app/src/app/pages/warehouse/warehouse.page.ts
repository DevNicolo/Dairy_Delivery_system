import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonNote, IonBadge, IonIcon, IonText } from '@ionic/angular/standalone';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.page.html',
  styleUrls: ['./warehouse.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonNote, IonBadge, IonIcon, IonText],
})
export class WarehousePage implements OnInit {
  public home!: string;
  private activatedRoute = inject(ActivatedRoute);

  public apiData: any;
  private apiService = inject(ApiService);
  constructor() {}

  ngOnInit() {
    this.home = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.getCompleteWarehouse();
  }

  getCompleteWarehouse() {
    this.apiService.getProducts('').subscribe({
      next: (response) => {
        this.apiData = response.result;
      },
      error: (error) => {
        console.error('Qualcosa è andato storto:', error);
      }
    });
  } 
}