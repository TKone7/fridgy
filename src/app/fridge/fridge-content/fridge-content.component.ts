import { ItemService } from './../../services/item.service';
import { Item } from './../../models/item';
import { ProductService } from './../../services/product.service';
import { Product } from './../../models/product';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FridgeService } from './../../services/fridge.service';
import { Component, OnInit } from '@angular/core';
import { Fridge } from 'src/app/models/fridge';

@Component({
  selector: 'fridge-content',
  templateUrl: './fridge-content.component.html',
  styleUrls: ['./fridge-content.component.css']
})
export class FridgeContentComponent implements OnInit {

  currentFridge: Fridge;
  items: Item[];

  constructor(
    private fridgeService: FridgeService,
    private itemService: ItemService,
    private productService: ProductService
  ) {
    this.fridgeService.currentFridge.pipe(
      switchMap(fridge => {
        this.currentFridge = fridge;
        if (fridge){
          this.itemService.initFridge(fridge.id);
          return this.itemService.getAll();
        }
        else return new Observable<Item[]>(null);
      })
    )
    .subscribe(items => {
      this.items = items;
      this.items.forEach(item => {
        this.productService.get(item.barcode).subscribe(product => {
          item.product = product;
        });
      });
    });
   }

  ngOnInit() {
  }

}
