import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'campaigns', pathMatch: 'full'},
  {
    path: 'campaigns',
    loadChildren: () => import('./pages/campaigns/route').then(route => route.routes)
  }
];
