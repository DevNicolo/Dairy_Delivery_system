import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderCheckPage } from './order-check.page';

describe('OrderCheckPage', () => {
  let component: OrderCheckPage;
  let fixture: ComponentFixture<OrderCheckPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
