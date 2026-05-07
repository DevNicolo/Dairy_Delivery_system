import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButton, 
         IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonIcon, 
         IonCardContent} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { OrderService } from '../../services/order';
import { RouterLink } from '@angular/router';
import { calendarOutline, cubeOutline, locationOutline, mapOutline, personOutline } from 'ionicons/icons';
import { InvoiceService } from '../../services/invoice';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, CommonModule, FormsModule, 
            IonButton, IonButtons, IonMenuButton, RouterLink, IonCard,
            IonCardHeader, IonCardTitle, IonIcon, IonCardContent ]
})
export class OrdersPage implements OnInit {

  private orderService = inject(OrderService);
  public orders: any;
  
  constructor() { 
    addIcons({ calendarOutline, personOutline, locationOutline, mapOutline, cubeOutline});
  }

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
