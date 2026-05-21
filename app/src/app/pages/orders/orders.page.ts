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
        this.orders = response.result.orders; 
        
        // Calculate the badges for each order as soon as they arrive
        this.orders.forEach((order: any) => {
          this.calculateBadge(order);
        });
      },
      error: (error) => {
        console.error('error:', error);
      }
    });
  }

  calculateBadge(order: any) {
    const payment = order.payment_state;

    // Set the initial status directly on the order
    order.badge = { label: 'Caricamento...', cssClass: 'status-gray' };

    // 1. Yellow: Payment missing
    if (payment === 'not_paid' || payment === 'partial') {
      order.badge = { label: 'Da Pagare', cssClass: 'status-yellow' };
      return; 
    } 
    // 2. Green: Everything is ready
    else if (payment === 'paid') {
      order.badge = { label: 'Completato', cssClass: 'status-green' };
      return; 
    }

    // If the invoice is missing (no_invoice), check delivery using order_id
    this.orderService.getDeliveryStatus(order.order_id).subscribe({
      next: (response) => {
        const delivery = response.result.picking_state;
        
        // 3. Blue: In delivery
        if (payment === 'no_invoice' && delivery !== 'done') {
          order.badge = { label: 'In Consegna', cssClass: 'status-blue' };
        } 
        // 4. Orange: Invoice missing (but delivery completed)
        else if (payment === 'no_invoice') {
          order.badge = { label: 'Da Fatturare', cssClass: 'status-orange' };
        } else {
          order.badge = { label: 'In elaborazione', cssClass: 'status-gray' };
        }
      },
      error: (error) => {
        console.error('error fetching status:', error);
        order.badge = { label: 'Errore', cssClass: 'status-gray' };
      }
    });
  }
}
