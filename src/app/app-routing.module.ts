import { FridgeSettingsComponent } from './fridge-settings/fridge-settings.component';
import { FridgeContentComponent } from './fridge/fridge-content/fridge-content.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { RegisterComponent } from './register/register.component';
import { ScannerComponent } from './scanner/scanner.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: FridgeContentComponent,
    canActivate: [AuthGuard]
  },
  { path: 'products', component: ProductsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component:  LoginComponent},
  { path: 'register', component:  RegisterComponent},
  { path: 'scanner', component: ScannerComponent},
  {
    path: 'fridge/:fridgeId',
    component: FridgeSettingsComponent,
    canActivate: [AuthGuard]
  },{
    path: 'fridge',
    component: FridgeContentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminAuthGuard]
  },
  {
    path: 'admin/products/:barcode',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminAuthGuard]
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard, AdminAuthGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard, AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
