import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonLabel, IonItem, IonList, IonButton } from '@ionic/angular/standalone';

import { OrderService } from '../../services/order';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, CommonModule, FormsModule, IonLabel, IonItem, IonList, IonButton, RouterLink]
})
export class OrdersPage implements OnInit {

  private orderService = inject(OrderService);
  public orders: any;
  
  constructor() { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        console.log('success:', response);
        this.orders = response.result.orders; // saving the data that arrives
      },
      error: (error) => {
        console.error('error:', error);
      }
    });
  }
}
