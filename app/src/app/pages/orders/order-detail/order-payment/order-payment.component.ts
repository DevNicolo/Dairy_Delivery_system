import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, 
         IonIcon, IonInput, IonItem, IonLabel, IonList, IonRadio, 
         IonRadioGroup, IonTitle, IonToolbar, 
         ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { cashOutline, cardOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonButtons, IonIcon, CommonModule, IonList, IonRadioGroup,
    IonItem, IonLabel, IonRadio, IonCheckbox, IonInput,
    FormsModule
  ]
})
export class OrderPaymentComponent  implements OnInit {

  @Input() orderName: string = '';
  @Input() orderTotal: number = 0;

  paymentMethod: string = '';
  isFullPayment: boolean = true;
  amountPaid: number = this.orderTotal;

  constructor() { 
    addIcons({ cashOutline, cardOutline, businessOutline });
  }

  ngOnInit() {}

  private modalCtrl = inject(ModalController);

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmWithPayment() {
    const paymentData = {
      generatePayment: true,
      paymentMethod: this.paymentMethod,
      amount: this.isFullPayment ? this.orderTotal : this.amountPaid
    };
    
    this.modalCtrl.dismiss(paymentData, 'confirm');
  }

  onToggleFullPayment() {
    if (this.isFullPayment) {
      this.amountPaid = this.orderTotal; // if full payment is toggled on, set the amount paid to the total of the order
    } else {
      this.amountPaid = 0; // else reset the amount paid to 0, so that the user can input the desired amount in the textarea
    }
  }
  
}
