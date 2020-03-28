import { FridgeManagerService } from './fridge-manager.service';
import { FridgeService } from './services/fridge.service';
import { UserService } from './services/user.service';
import { ScannerComponent } from './scanner/scanner.component';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { DummyDataService } from './services/dummy-data.service';
import { JwtHelperService, JwtModule, JwtInterceptor } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, forwardRef } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RefreshTokenInterceptor } from './refresh-token-interceptor';
import { ProductFormComponent } from './admin/product-form/product-form.component';
// import { CustomFormsModule } from 'ng2-validation';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductMainComponent } from './admin/product-main/product-main.component';
import { ProductNutrientComponent } from './admin/product-nutrient/product-nutrient.component';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { InventoryRecordComponent } from './fridge/inventory-record/inventory-record.component';
import { RegisterComponent } from './register/register.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { FridgeContentComponent } from './fridge/fridge-content/fridge-content.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FridgeSettingsComponent } from './fridge-settings/fridge-settings.component';
import { ScanActionComponent } from './scan-action/scan-action.component';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    CheckOutComponent,
    ShoppingCartComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductFormComponent,
    ScannerComponent,
    ProductMainComponent,
    ProductNutrientComponent,
    ProductFilterComponent,
    ProductCardComponent,
    InventoryRecordComponent,
    RegisterComponent,
    AdminUsersComponent,
    FridgeContentComponent,
    FridgeSettingsComponent,
    ScanActionComponent,
    FilterPipe,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatGridListModule,
    MatSliderModule,
    MatCardModule,
    AngularFontAwesomeModule,

    MatNativeDateModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: AuthService.getAccessToken,
        whitelistedDomains: [environment.baseDomain],
        blacklistedRoutes: []
      }
    }),
    NoopAnimationsModule
  ],
  providers: [
    AuthService,
    JwtHelperService,
    JwtInterceptor,
    DummyDataService,
    CategoryService,
    ProductService,
    UserService,
    FridgeService,
    FridgeManagerService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
