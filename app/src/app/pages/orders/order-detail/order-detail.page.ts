import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, 
         IonHeader, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, downloadOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { OrderAttemptedSaleComponent } from './order-attempted_sale/order-attempted_sale.page';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, 
            IonSpinner, IonLabel, IonList, IonItem, IonText, IonIcon, IonCardContent, IonCardTitle, 
            IonCardSubtitle, IonCard, IonCardHeader, IonButtons, IonButton]
})
export class OrderDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  public order_id: string | null = null;
  public order: any;

  constructor() { 
    addIcons({ calendarOutline, locationOutline, downloadOutline })
  }

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

  private modalController = inject(ModalController);

  async openConfirmModal() {
    const modal = await this.modalController.create({
      component: OrderAttemptedSaleComponent, // the component to display inside the modal
      componentProps: {
        orderName: this.order?.name // passing the order name as a prop to the modal component, so it can display it or use it as needed
      },
      // Configuring the modal to be presented as a sheet that can be dragged to different breakpoints
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });

    await modal.present();

    // Waiting for the modal to be dismissed and checking the role of dismissal to determine if the user confirmed the action
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log('L\'utente ha confermato!');
      // Here you can add the logic to handle the confirmation, such as updating the order status or making an API call
    }
  }
}
