import { FormBuilder, FormControl } from '@angular/forms';
import { GepirSearchService } from './../services/gepir-search.service';
import { Product } from './../models/product';
import { FridgeManagerService } from './../fridge-manager.service';
import { Item } from './../models/item';
import { Fridge } from './../models/fridge';
import { ItemService } from './../services/item.service';
import { FridgeService } from './../services/fridge.service';
import { AuthService, tokenUrl } from './../services/auth.service';
import { User } from './../models/user';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Router, ActivatedRoute } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { ProductService } from './../services/product.service';
import { Component} from '@angular/core';
import { BarcodeValidators } from '../products/barcode.validators';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

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
  availableCameras: MediaDeviceInfo[] = [];
  currentCamera: MediaDeviceInfo = null;
  currentCameraIndex: number;
  scannerEnabled = true;

  scanSuccessHandler(event){
    this.router.navigate([], { queryParams: { q: event } });
    this.loadProduct(event);
  }

  private loadProduct(barcode){
    this.clear();

    this.disableCamera();
    this.event = barcode;
    this.validateBarcode(barcode);
    if (!this.validBarcode) return;

    this.productService.get(barcode, true)
      .pipe(
        take(1)
      )
      .subscribe(product => {
        this.product = product;
        this.loadItems(product);
      }, (error: AppError) => {
        if (error instanceof NotFoundError) {
          this.showAddProduct = true;
        } else {
          throw error;
        }
    });
  }

  private clear(){
    this.showAddProduct = false;
    this.product = null;
    this.fridgeEntries = null;
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
      // use filter instead of splice to trigger ngOnChanges
      this.fridgeEntries = this.fridgeEntries.filter(element => element.id !== item.id);
    });
  }

  update(item: Item){
    this.itemService.update(item.id, item).subscribe(() => {
      // set an empty filter to trigger ngOnChanges
      this.fridgeEntries = this.fridgeEntries.filter(element => true);
    });
  }

  contScanning() {
    this.router.navigate([], { queryParams: null });
    this.activateCamera();
    this.clear();
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products', product.barcode], { queryParams: { returnUrl: this.router.url } });
  }

  createProduct() {
    this.router.navigate(['/admin/products/new'], { queryParams: { barcode: this.event, returnUrl: this.router.url }});
  }

  addToFridge() {
    this.fridgeManager.addItem(this.product).then(() => {
      this.loadItems(this.product);
    });
  }

  // get scanningInProgress(): boolean {
  //   return (!this.showAddProduct && !this.product);
  // }

  private validateBarcode(barcode: string){
    this.barcodeValidator.correctLength = BarcodeValidators.correctLength(barcode);
    this.barcodeValidator.validChecksum = BarcodeValidators.validChecksum(barcode);

    this.validBarcode = (this.barcodeValidator.correctLength && this.barcodeValidator.validChecksum);
  }

  camerasFoundHandler(cameras){
    console.log(cameras);
    this.availableCameras = (cameras as MediaDeviceInfo[]);
    let cameraIndex = (parseInt(localStorage.getItem('cameraPreference'), 10) || 0);
    console.log('load camera from local storage', cameraIndex);
    this.currentCameraIndex = cameraIndex;

    this.currentCamera = this.availableCameras[cameraIndex];
  }
  switchCamera(){
    this.currentCameraIndex = (this.currentCameraIndex + 1 ) % this.availableCameras.length;
    this.currentCamera = this.availableCameras[this.currentCameraIndex];
    localStorage.setItem('cameraPreference', this.currentCameraIndex.toString());
  }

  private activateCamera() {
    let cameraIndex = (parseInt(localStorage.getItem('cameraPreference'), 10) || 0);
    console.log('set camera to ', cameraIndex, this.availableCameras[cameraIndex]);
    this.currentCamera = this.availableCameras[cameraIndex];
    this.scannerEnabled = true;
    console.log('current cam', this.currentCamera);

  }
  private disableCamera() {
    localStorage.setItem('cameraPreference', this.currentCameraIndex.toString());
    this.scannerEnabled = false;
  }


  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fridgeService: FridgeService,
    private itemService: ItemService,
    private fridgeManager: FridgeManagerService,
  ) {
    ZXingScannerComponent.prototype.reset = function() {
      this._reset();
      setTimeout(() => {
          this.deviceChange.emit(null);
      });
    };

    this.currentUser = this.authService.currentUserValue;

    this.fridgeService.currentFridge.subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
        this.itemService.initFridge(fridge.id);
        if (this.product) this.loadItems(this.product);
      }
    });

    this.route.queryParamMap.subscribe(qParam => {
      const barcode = qParam.get('q');
      if (barcode) this.loadProduct(barcode);
    });
  }
}
