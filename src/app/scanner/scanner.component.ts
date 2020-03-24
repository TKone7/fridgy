import { Product } from './../models/product';
import { FridgeManagerService } from './../fridge-manager.service';
import { DatePipe } from '@angular/common';
import { Item } from './../models/item';
import { Fridge } from './../models/fridge';
import { ItemService } from './../services/item.service';
import { FridgeService } from './../services/fridge.service';
import { AuthService } from './../services/auth.service';
import { User } from './../models/user';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { ProductService } from './../services/product.service';
import { Component} from '@angular/core';

@Component({
  selector: 'scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent {
  currentUser: User;
  event: string;
  product: Product;
  currentFridge: Fridge;
  fridgeEntries: Item[] = [];
  showAddProduct = false;

  scanSuccessHandler(event){
    this.showAddProduct = false;
    this.event = event;
    this.productService.get(event)
        .pipe(
          take(1),
        )
        .subscribe(product => {
          this.product = product;
          this.loadItems(product);
        }
          , (error: AppError) => {
            if (error instanceof NotFoundError) {
              this.showAddProduct = true;
            } else {
              throw error;
            }
          });
  }

  private loadItems(product: Product) {
    this.itemService.getAll({filter: {field: 'barcode', value: product.barcode}})
    .subscribe(items => {
      this.fridgeEntries = items;
      this.fridgeEntries.forEach(entry => {
        entry.product = product;
      });
    });
  }

  remove(item: Item){
    this.itemService.delete(item.id).subscribe(response => {
      // let index = this.fridgeEntries.indexOf(item);
      // use filter instead of splice to trigger ngOnChanges
      this.fridgeEntries = this.fridgeEntries.filter(element => element.id !== item.id);
    });
  }

  contScanning() {
    this.showAddProduct = false;
    this.product = null;
    this.fridgeEntries = null;
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products', product.barcode]);
  }

  createProduct() {
    this.router.navigate(['/admin/products/new'], { queryParams: { barcode: this.event }});
  }

  addToFridge() {
    this.fridgeManager.addItem(this.product).then(() => {
      this.loadItems(this.product);
    });
  }

  get scanningInProgress(): boolean {
    return (!this.showAddProduct && !this.product);
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private fridgeService: FridgeService,
    private itemService: ItemService,
    private fridgeManager: FridgeManagerService,
  ) {
    this.currentUser = this.authService.currentUserValue;

    this.fridgeService.currentFridge.subscribe(fridge => {
      this.currentFridge = fridge;
      this.itemService.initFridge(fridge.id);
      if (this.product) this.loadItems(this.product);
    });
  }
}
