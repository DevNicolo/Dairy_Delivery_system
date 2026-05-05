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
import { OrderInvoiceCreateComponent } from './order-invoice-create/order-invoice-create.component';

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
      this.orderService.getOrderById(parseInt(this.order_id)).subscribe({
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

  // modal flow

  async openConfirmModal() {
    // open the first popup (attempted sale)
    const attempted_sale_modal = await this.modalController.create({
      component: OrderAttemptedSaleComponent,
      componentProps: { orderName: this.order?.name },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });

    await attempted_sale_modal.present();

    const { data, role } = await attempted_sale_modal.onWillDismiss();

    if (role === 'confirm' && data?.selection) {
    
    // add products
    this.orderService.addProductsToOrder(parseInt(this.order_id!), data.selection).subscribe({
      next: (resAdd) => {
        console.log('Prodotti aggiunti:', resAdd);

        // retrieve vehicle
        this.orderService.getDailyVehicle().subscribe({
          next: (resVehicle) => {
            const vehicle_id = resVehicle.result.vehicle_numeric_id;
            console.log('Veicolo recuperato:', vehicle_id);

            // confirm order
            this.orderService.confirmOrder(parseInt(this.order_id!), vehicle_id).subscribe({
              next: (resConfirm) => {
                console.log('Ordine confermato definitivamente:', resConfirm);
                
                // open invoice modal
                this.openInvoiceModal(vehicle_id, data.selection);
              },
              error: (err) => console.error('Errore conferma ordine:', err)
            });
          },
          error: (err) => console.error('Errore veicolo:', err)
        });
      },
      error: (err) => console.error('Errore aggiunta prodotti:', err)
    });
    }
  }

  async openInvoiceModal(vehicle_id: number, selection: any) {
    const invoice_modal = await this.modalController.create({
      component: OrderInvoiceCreateComponent,
      componentProps: { 
        orderName: this.order?.name,
        selection: selection 
      },
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5
    });

    await invoice_modal.present();

    const { data, role } = await invoice_modal.onWillDismiss();

    if (role === 'confirm') {
      //to be continued 
    }
  }
}
