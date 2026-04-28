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
  standalone: true, // Fondamentale per Ionic moderno
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonButtons, IonIcon, CommonModule
  ]
})
export class OrderInvoiceCreateComponent implements OnInit {
  // Input ricevuti dal primo popup tramite la pagina di sfondo
  @Input() orderName: string = '';
  @Input() selection: { [key: number]: number } = {};

  private modalCtrl = inject(ModalController);

  constructor() {
    // Registriamo le icone che useremo nel template
    addIcons({ checkmarkCircleOutline, receiptOutline });
  }

  ngOnInit() {
    // Debug per verificare che la HashMap sia arrivata correttamente
    console.log('Prodotti da processare nel secondo step:', this.selection);
  }

  // Chiude il popup e annulla tutto il processo
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Chiude confermando la volontà di creare la fattura
  confirmWithInvoice() {
    this.modalCtrl.dismiss({ 
      generateInvoice: true, 
      selection: this.selection 
    }, 'confirm');
  }

  // Chiude confermando l'aggiunta prodotti ma saltando la fattura
  confirmWithoutInvoice() {
    this.modalCtrl.dismiss({ 
      generateInvoice: false, 
      selection: this.selection 
    }, 'confirm');
  }
}