import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonButtons, IonIcon, ModalController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, receiptOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order-invoice-create',
  templateUrl: './order-invoice-create.component.html',
  styleUrls: ['./order-invoice-create.component.scss'],
  standalone: true, // Essential for modern Ionic
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonButtons, IonIcon, CommonModule
  ]
})
export class OrderInvoiceCreateComponent implements OnInit {
  // Inputs received from the first popup through the background page
  @Input() orderName: string = '';
  @Input() selection: { [key: number]: number } = {};

  private modalCtrl = inject(ModalController);

  constructor() {
    // Register the icons we will use in the template
    addIcons({ checkmarkCircleOutline, receiptOutline });
  }

  ngOnInit() {
    // Debug to verify the HashMap arrived correctly
    console.log('Prodotti da processare nel secondo step:', this.selection);
  }

  // Close the popup and cancel the entire process
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Close confirming the intent to create the invoice
  confirmWithInvoice() {
    this.modalCtrl.dismiss({ 
      generateInvoice: true, 
      selection: this.selection 
    }, 'confirm');
  }

  // Close confirming product addition but skipping the invoice
  confirmWithoutInvoice() {
    this.modalCtrl.dismiss({ 
      generateInvoice: false, 
      selection: this.selection 
    }, 'confirm');
  }
}