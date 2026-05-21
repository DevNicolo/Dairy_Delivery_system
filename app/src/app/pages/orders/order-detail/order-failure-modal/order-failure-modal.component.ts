import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order-failure-modal',
  templateUrl: './order-failure-modal.component.html',
  styleUrls: ['./order-failure-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonFooter, IonToolbar, IonButtons, IonContent, IonHeader, IonButton, IonTitle]
})
export class OrderFailureModalComponent  implements OnInit {

  private modalCtrl = inject(ModalController);

  constructor() { 
    addIcons({ closeOutline });
  }

  ngOnInit() {}

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss({ 
      confirmed: true 
    }, 
      'confirm');
  }

}
