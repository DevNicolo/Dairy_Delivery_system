import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderFailureModalComponent } from './order-failure-modal.component';

describe('OrderFailureModalComponent', () => {
  let component: OrderFailureModalComponent;
  let fixture: ComponentFixture<OrderFailureModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OrderFailureModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFailureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
