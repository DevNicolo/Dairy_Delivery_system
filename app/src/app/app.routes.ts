import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home/orders',
    loadComponent: () => import('./pages/orders/orders.page').then( m => m.OrdersPage),
    canActivate: [authGuard],
  },
  {
    path: 'order-detail/:order_id', // page is dynamic and receives the order_id as a parameter to display the details of the selected order
    loadComponent: () => import('./pages/orders/order-detail/order-detail.page').then( m => m.OrderDetailPage)
  },
];
