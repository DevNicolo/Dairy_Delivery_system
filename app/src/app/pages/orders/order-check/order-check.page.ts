import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonFooter, IonBackButton, IonButtons, IonSpinner, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, scanOutline, cubeOutline, checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order-check',
  templateUrl: './order-check.page.html',
  styleUrls: ['./order-check.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonFooter, IonBackButton, IonButtons, IonSpinner, IonFab, IonFabButton, CommonModule, FormsModule]
})
export class OrderCheckPage implements OnInit {
  scanResult: string | undefined = undefined;
  orderId: string | null = null;
  orderName: string | null = null;
  order: any = null;

  isOrderVerified: boolean = false;
  scannedQuantities: { [productName: string]: number } = {};

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  constructor() {
    addIcons({ checkmarkCircle, closeCircle, scanOutline, cubeOutline, checkmarkDoneOutline });
  }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('order_id');
    if (this.orderId) {
      this.orderService.getOrderById(parseInt(this.orderId)).subscribe({
        next: (res) => {
          if (res.result && res.result.orders && res.result.orders.length > 0) {
            this.order = res.result.orders[0];
            this.orderName = this.order.name;
            
            if (this.order && this.order.products) {
              const savedState = localStorage.getItem(`order_check_${this.orderId}`);
              if (savedState) {
                const parsed = JSON.parse(savedState);
                this.isOrderVerified = parsed.isOrderVerified || false;
                this.scannedQuantities = parsed.scannedQuantities || {};
                
                this.order.products.forEach((p: any) => {
                  if (this.scannedQuantities[p.product] === undefined) {
                    this.scannedQuantities[p.product] = 0;
                  }
                });
              } else {
                this.order.products.forEach((p: any) => {
                  this.scannedQuantities[p.product] = 0;
                });
              }
            }
          }
        },
        error: (err) => console.error('Error fetching order:', err)
      });
    }
  }

  saveState() {
    if (this.orderId) {
      localStorage.setItem(`order_check_${this.orderId}`, JSON.stringify({
        isOrderVerified: this.isOrderVerified,
        scannedQuantities: this.scannedQuantities
      }));
    }
  }

  async startScan() {
    const granted = await this.requestPermissions();
    if (!granted) {
      alert('Permesso per la fotocamera negato.');
      return;
    }

    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length > 0 && barcodes[0].rawValue) {
        this.processQRData(barcodes[0].rawValue);
      }
    } catch (error) {
      console.error('Errore durante la scansione', error);
    }
  }

  processQRData(qrData: string) {
    if (!this.orderName || !this.order) return;

    if (qrData.includes(this.orderName)) {
      this.isOrderVerified = true;
    }

    const regex = /-\s*(.+?)\s*\(Qty:\s*([\d.]+)\)/g;
    let match;
    let productsFound = 0;

    while ((match = regex.exec(qrData)) !== null) {
      const productName = match[1].trim();
      const qty = parseFloat(match[2]);

      if (this.scannedQuantities[productName] !== undefined) {
        this.scannedQuantities[productName] += qty;
        productsFound++;
      } else {
         const fuzzyMatch = Object.keys(this.scannedQuantities).find(key => key.includes(productName) || productName.includes(key));
         if (fuzzyMatch) {
            this.scannedQuantities[fuzzyMatch] += qty;
            productsFound++;
         }
      }
    }

    if (productsFound > 0 || qrData.includes(this.orderName)) {
      this.saveState();
    } else {
      alert("QR Code non riconosciuto: non contiene prodotti per questo ordine e non corrisponde al numero d'ordine.");
    }
  }

  isAllCompleted(): boolean {
    if (!this.order || !this.order.products) return false;
    
    if (!this.isOrderVerified) return false;

    for (const item of this.order.products) {
      const scanned = this.scannedQuantities[item.product] || 0;
      if (scanned < item.quantity) {
        return false;
      }
    }
    return true;
  }

  completeCheck() {
    if (this.isAllCompleted()) {
      this.router.navigate(['/orders']);
    } else {
      alert("Non hai verificato tutti i prodotti");
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
}
