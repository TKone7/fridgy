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
import { Product } from '../models/product';

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
          switchMap(p => {
            this.product = p;
            return this.itemService.getAll({filter: {field: 'barcode', value: p.barcode}});
          })
        )
        .subscribe(items => {
          this.fridgeEntries = items;
        }
          , (error: AppError) => {
            if (error instanceof NotFoundError) {
              console.log('handled error');
              this.showAddProduct = true;
            } else {
              throw error;
            }
          });
  }

  remove(item: Item){
    this.itemService.delete(item.id).subscribe(response => {
      let index = this.fridgeEntries.indexOf(item);
      this.fridgeEntries.splice(index, 1);
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
    // check if fridgeEntries has an item from today
    let currentItem = this.popCurrentItem();
    if (currentItem){
      currentItem.qty++;
      this.itemService.update(currentItem.id, currentItem).subscribe(item => {
      });
    }else{
      let newItem = this.createNewItem();
      this.itemService.create(newItem).subscribe(item => {
        this.fridgeEntries.push(item);
      }
      );
    }
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
    private datePipe: DatePipe
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.fridgeService.currentFridge.subscribe(fridge => {
      this.currentFridge = fridge;
      this.itemService.initFridge(fridge.id);
    });
  }

  private popCurrentItem(): Item | null {
    let today = new Date();
    let todayStr = this.datePipe.transform(today, 'yyyy-MM-dd');
    console.log(todayStr);
    return this.fridgeEntries.filter(item => item.created === todayStr).pop();
  }

  private createNewItem(): Item {
    return {
      barcode: this.product.barcode,
      fridge: this.currentFridge.id,
      qty: 1
    };
  }

}
