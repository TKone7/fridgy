import { FormBuilder, FormControl } from '@angular/forms';
import { GepirSearchService } from './../services/gepir-search.service';
import { Product } from './../models/product';
import { FridgeManagerService } from './../fridge-manager.service';
import { DatePipe } from '@angular/common';
import { Item } from './../models/item';
import { Fridge } from './../models/fridge';
import { ItemService } from './../services/item.service';
import { FridgeService } from './../services/fridge.service';
import { AuthService, tokenUrl } from './../services/auth.service';
import { User } from './../models/user';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { ProductService } from './../services/product.service';
import { Component} from '@angular/core';
import { BarcodeValidators } from '../products/barcode.validators';

@Component({
  selector: 'scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent {
  currentUser: User;
  event: string;
  barcodeValidator =  {correctLength: true, validChecksum: true};
  validBarcode = true;
  product: Product;
  currentFridge: Fridge;
  fridgeEntries: Item[] = [];
  showAddProduct = false;

  scanSuccessHandler(event){
    this.showAddProduct = false;
    this.event = event;
    this.validateBarcode(event);
    if (!this.validBarcode) return;

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

  reduce(item: Item){
    item.qty -= 1 / item.product.qty;
    console.log('left: ', item.qty);
    if (Math.round(item.qty * 100) / 100 === 0.0)
      this.remove(item);
    else
      this.itemService.update(item.id, item).subscribe(() => {
        this.fridgeEntries = this.fridgeEntries.filter(element => true);
      }
    );
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

  private validateBarcode(barcode: string){
    this.barcodeValidator.correctLength = BarcodeValidators.correctLength(barcode);
    this.barcodeValidator.validChecksum = BarcodeValidators.validChecksum(barcode);

    this.validBarcode = (this.barcodeValidator.correctLength && this.barcodeValidator.validChecksum);
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private fridgeService: FridgeService,
    private itemService: ItemService,
    private fridgeManager: FridgeManagerService,
    private gepirService: GepirSearchService,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.currentUserValue;

    this.fridgeService.currentFridge.subscribe(fridge => {
      this.currentFridge = fridge;
      this.itemService.initFridge(fridge.id);
      if (this.product) this.loadItems(this.product);
    });
  }
}
