import { AuthService } from './../services/auth.service';
import { User } from './../models/user';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProductService } from './../services/product.service';
import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { Product } from '../models/product';

@Component({
  selector: 'scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  currentUser: User;
  event: string;
  product: Product;
  fridgeEntries: any;
  showAddProduct = false;

  scanSuccessHandler(event){
    this.showAddProduct = false;
    this.event = event;
    this.productService.get(event)
        .pipe(take(1))
        .subscribe(p => this.product = p
          , (error: AppError) => {
            if (error instanceof NotFoundError) {
              console.log('handled error');
              this.showAddProduct = true;
            } else {
              throw error;
            }
          });
  }

  contScanning() {
    this.showAddProduct = false;
    this.product = null;
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products', product.barcode]);
  }

  createProduct() {
    this.router.navigate(['/admin/products/new'], { queryParams: { barcode: this.event }});
  }

  get scanningInProgress(): boolean {
    return (!this.showAddProduct && !this.product);
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;

  }

  ngOnInit() {
  }

}
