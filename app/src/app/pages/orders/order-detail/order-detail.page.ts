import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton]
})
export class OrderDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  public order_id: string | null = null;

  constructor() { }

  ngOnInit() {
    this.order_id = this.route.snapshot.paramMap.get('order_id'); // retrieving the order_id parameter from the route to display the details of the selected order
  }

}
