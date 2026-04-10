import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, 
         IonHeader, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, 
            IonSpinner, IonLabel, IonList, IonItem, IonText, IonIcon, IonCardContent, IonCardTitle, 
            IonCardSubtitle, IonCard, IonCardHeader, IonButtons]
})
export class OrderDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  public order_id: string | null = null;
  public order: any;

  constructor() { }

  ngOnInit() {
    this.order_id = this.route.snapshot.paramMap.get('order_id'); // retrieving the order_id parameter from the route to display the details of the selected order
    this.loadOrder();
  }

  loadOrder() {
    console.log('Loading order with ID:', this.order_id);
    if (this.order_id) {
      this.orderService.getProductById(parseInt(this.order_id)).subscribe({
        next: (response) => {
          console.log('success:', response);
          const [singleOrder] = response.result.orders; // using destructuring to extract the order from the array
          this.order = singleOrder; // saving the data that arrives
        },
      error: (error) => {
        console.error('error:', error);
      }
      });
    }
  }
}
