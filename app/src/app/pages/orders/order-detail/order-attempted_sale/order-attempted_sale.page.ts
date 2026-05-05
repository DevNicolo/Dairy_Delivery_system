import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonButtons, IonList, IonItem, IonLabel, IonInput, IonIcon, 
  IonSpinner
} from '@ionic/angular/standalone';
import { ProductService } from '../../../../services/product';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-order-attempted-sale',
  templateUrl: './order-attempted_sale.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonButtons, IonList, IonItem, IonLabel, IonInput, 
    IonIcon, CommonModule, FormsModule, IonSpinner
  ]
})
export class OrderAttemptedSaleComponent implements OnInit {
  @Input() orderName: string = '';
  
  private modalCtrl = inject(ModalController);
  private productService = inject(ProductService);
  
  apiData: any[] = [];
  quantities: { [key: number]: number } = {}; 

  constructor() {
    addIcons({ addOutline, removeOutline });
  }
  
  ngOnInit() {
    this.productService.getProducts('virtual').subscribe({
      next: (response) => {
        this.apiData = response.result;
        // Inizialize quantities for each product
        this.apiData.forEach(p => this.quantities[p.id] = 0);
      }
    });
  }

  changeQty(id: number, delta: number, available: number) {
    const newVal = (this.quantities[id] || 0) + delta;
    this.quantities[id] = newVal < 0 ? 0 : newVal;

    // Ensure we don't exceed available stock    
    if (this.quantities[id] > available) {
      this.quantities[id] = available;
    }
  }

  onQtyChange(id: number, available: number) {
    let value = Number(this.quantities[id]) || 0;
    if (value < 0) {
      value = 0;
    } else if (value > available) {
      value = available;
    }
    this.quantities[id] = value;
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss({ 
      confirmed: true, 
      selection: this.quantities 
    }, 'confirm');
  }
}