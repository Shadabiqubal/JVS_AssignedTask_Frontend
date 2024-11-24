import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';

export const routes: Routes = [
    {path:'',redirectTo:'vendor-list',pathMatch:'full'},
    {
        path: 'vendor-list',
        loadComponent: () =>
          import('./vendor-list/vendor-list.component').then(
            (m) => m.VendorListComponent
          ),
      },
      {
        path: 'vendor-registration',
        loadComponent: () =>
          import('./vendor-form/vendor-form.component').then(
            (m) => m.VendorFormComponent
          ),
      },
];
