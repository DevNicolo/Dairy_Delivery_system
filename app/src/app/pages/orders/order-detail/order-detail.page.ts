import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, 
         IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, downloadOutline, receiptOutline, cashOutline, checkmarkCircle } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { OrderAttemptedSaleComponent } from './order-attempted_sale/order-attempted_sale.page';
import { OrderInvoiceCreateComponent } from './order-invoice-create/order-invoice-create.component';
import { InvoiceService } from '../../../services/invoice';
import { OrderPaymentComponent } from './order-payment/order-payment.component';
import { PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, 
            IonSpinner, IonIcon, IonButtons, IonButton, IonFooter]
})
export class OrderDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private invoceService = inject(InvoiceService);
  private paymentService = inject(PaymentService);
  private modalController = inject(ModalController);

  public order_id: string | null = null;
  public order: any;
  public invoice: any;
  public invoice_id: number | null = null;
  
  public deliveryStatus: string = 'unknown';
  public paymentStatus: string = 'unknown';
  public paymentAmountResidual: number = 0;

  // Global flag to prevent UI glitches during data fetching
  public isCheckingStatus: boolean = true;

  constructor() { 
    addIcons({ calendarOutline, locationOutline, downloadOutline, receiptOutline, cashOutline, checkmarkCircle })
  }

  ngOnInit() {
    this.order_id = this.route.snapshot.paramMap.get('order_id');
    this.reloadAllData();
  }

  /**
   * Master method to fetch all required order data sequentially.
   * This ensures the UI is perfectly synced and avoids flickering buttons.
   */
  reloadAllData() {
    if (!this.order_id) return;
    
    // Lock the UI
    this.isCheckingStatus = true; 
    const id = parseInt(this.order_id);

    // 1. Fetch Order
    this.orderService.getOrderById(id).subscribe({
      next: (orderRes) => {
        const [singleOrder] = orderRes.result.orders;
        this.order = singleOrder;
        
        // 2. Fetch Delivery Status
        this.orderService.getDeliveryStatus(id).subscribe({
          next: (delRes) => {
            this.deliveryStatus = delRes.result.picking_state;

            // 3. Fetch Invoice ID
            this.invoceService.getInvoiceId(id).subscribe({
              next: (invRes) => {
                this.invoice_id = invRes.result.invoice_id;
                this.invoice = invRes.result.invoice_id;

                if (this.invoice_id) {
                  // 4. If Invoice exists, fetch Payment Status
                  this.paymentService.getPaymentStatus(this.invoice_id).subscribe({
                    next: (payRes) => {
                      this.paymentStatus = payRes.result.payment_status;
                      this.paymentAmountResidual = payRes.result.amount_residual;
                      
                      // Sequence completed successfully
                      this.isCheckingStatus = false; 
                    },
                    error: (err) => { 
                      console.error('Error fetching payment status:', err);
                      this.paymentStatus = 'error'; 
                      this.isCheckingStatus = false; 
                    }
                  });
                } else {
                  // Sequence completed (no invoice)
                  this.isCheckingStatus = false; 
                }
              },
              error: (err) => { 
                console.error('Error fetching invoice ID:', err);
                this.isCheckingStatus = false; 
              }
            });
          },
          error: (err) => { 
            console.error('Error fetching delivery status:', err);
            this.deliveryStatus = 'error'; 
            this.isCheckingStatus = false; 
          }
        });
      },
      error: (err) => { 
        console.error('Error fetching order:', err);
        this.isCheckingStatus = false; 
      }
    });
  }

  // --- MODAL FLOW ---

  async openConfirmModal() {
    const attempted_sale_modal = await this.modalController.create({
      component: OrderAttemptedSaleComponent,
      componentProps: { orderName: this.order?.name },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5
    });

    await attempted_sale_modal.present();
    const { data, role } = await attempted_sale_modal.onWillDismiss();

    if (role === 'confirm' && data?.selection) {
      this.isCheckingStatus = true; // Lock UI during API calls

      this.orderService.addProductsToOrder(parseInt(this.order_id!), data.selection).subscribe({
        next: (resAdd) => {
          this.orderService.confirmOrder(parseInt(this.order_id!)).subscribe({
            next: (resConfirm) => {
              // Open invoice modal sequentially
              this.openInvoiceModal();
            },
            error: (err) => {
              console.error('Error confirming order:', err);
              this.reloadAllData(); // Unlock UI on error
            }
          });
        },
        error: (err) => {
          console.error('Error adding products:', err);
          this.reloadAllData(); // Unlock UI on error
        }
      });
    }
  }

  async openInvoiceModal() {
    const invoice_modal = await this.modalController.create({
      component: OrderInvoiceCreateComponent,
      componentProps: { orderName: this.order?.name },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5
    });

    await invoice_modal.present();
    const { data, role } = await invoice_modal.onWillDismiss();

    if (role === 'confirm' && data?.generateInvoice) {
      this.isCheckingStatus = true; // Lock UI during API calls

      this.invoceService.createInvoice(parseInt(this.order_id!)).subscribe({
        next: (res) => {
          // Re-fetch data to get the new invoice_id, then trigger payment modal automatically
          // We use a custom fetch sequence here instead of reloadAllData to avoid unlocking the UI too early
          this.invoceService.getInvoiceId(parseInt(this.order_id!)).subscribe({
            next: (invRes) => {
              this.invoice_id = invRes.result.invoice_id;
              
              if (this.invoice_id) {
                this.paymentService.getPaymentStatus(this.invoice_id).subscribe({
                  next: (payRes) => {
                    this.paymentAmountResidual = payRes.result.amount_residual;
                    this.isCheckingStatus = false; // Unlock UI right before opening next modal
                    this.openPaymentModal(); 
                  }
                });
              } else {
                this.reloadAllData();
              }
            }
          });
        },
        error: (err) => {
          console.error('Error creating invoice:', err);
          this.reloadAllData();
        }
      });
    } else {
      this.reloadAllData(); 
    }
  }

  async openPaymentModal() {
    const payment_modal = await this.modalController.create({
      component: OrderPaymentComponent,
      componentProps: { 
        orderName: this.order?.name,
        orderTotal: this.order?.total,
        amountResidual: this.paymentAmountResidual,
      },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5
    });

    await payment_modal.present();
    const { data, role } = await payment_modal.onWillDismiss();

    if (role === 'confirm' && data?.generatePayment) {
      this.isCheckingStatus = true; // Lock UI during API calls

      this.paymentService.confirmPayment(this.invoice_id!, data.paymentMethod, data.amount).subscribe({
        next: (res) => {
          this.reloadAllData(); // Reload completely to show success status
        },
        error: (err) => {
          console.error('Error confirming payment:', err);
          this.reloadAllData();
        }
      });
    } else {
      this.reloadAllData(); 
    }
  }
}