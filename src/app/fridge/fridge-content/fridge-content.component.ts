import { Category } from './../../models/category';
import { CategoryService } from './../../services/category.service';
import { Router } from '@angular/router';
import { ItemService } from './../../services/item.service';
import { Item } from './../../models/item';
import { ProductService } from './../../services/product.service';
import { Product } from './../../models/product';

import { switchMap, map, flatMap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FridgeService } from './../../services/fridge.service';
import { Component, OnInit } from '@angular/core';
import { Fridge } from 'src/app/models/fridge';


@Component({
  selector: 'fridge-content',
  templateUrl: './fridge-content.component.html',
  styleUrls: ['./fridge-content.component.css']
})
export class FridgeContentComponent {
  inProgress = false;
  currentFridge: Fridge;
  items: Item[];
  categories: Category[];

  filterProductCategory(item: Item, categorySlug: string){
    return item.product.category === categorySlug;
  }
  filterProductExpire(item: Item){
    if (!item.expiry) return false;

    let exp = new Date(item.expiry);
    let today = new Date();
    let diffc = exp.getTime() - today.getTime();
    let days = Math.ceil(diffc / (1000 * 60 * 60 * 24));
    return days <= 5;
  }
  constructor(
    private fridgeService: FridgeService,
    private itemService: ItemService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.fetchCategories();
    this.fetchData();
   }

  remove(item: Item){
    this.itemService.delete(item.id).subscribe(response => {
      // use filter instead of splice to trigger ngOnChanges
      this.items = this.items.filter(element => element.id !== item.id);
    });
  }

  update(item: Item){
    this.itemService.update(item.id, item).subscribe(() => {
      // set an empty filter to trigger ngOnChanges
      this.items = this.items.filter(element => true);
    });
  }

  goToScan() {
    this.router.navigate(['/scanner']);
  }

  async getProduct(item: Item) {
    return this.productService.get(item.barcode).toPromise();
  }

  async fetchData() {
    console.log('fetchData started');
    this.fridgeService.currentFridge.subscribe(async fridge => {
      this.currentFridge = fridge;
      this.itemService.initFridge(fridge.id);
      this.items = [];
      this.inProgress = true;

      let items = await this.itemService.getAll().toPromise();
      console.log('items', items);


      this.items = await Promise.all(items.map(async (item) => {
        const prod = await this.getProduct(item);
        item.product = prod;
        console.log(item);
        return item;
      }));
      this.inProgress = false;

    });
  }
  async fetchCategories() {
     this.categories = await this.categoryService.getAll({
      order: {
        column: 'slug',
        dir: 'desc'
      }}).toPromise();
  }
}
