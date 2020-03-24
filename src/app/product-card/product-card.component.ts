import { Item } from './../models/item';
import { Product } from './../models/product';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnChanges {
  @Input('product') product: Product;
  @Input('show-actions') showActions = true;
  @Input('items') items: Item[] = [];

  @Output() close = new EventEmitter();
  @Output('add') addEmitter = new EventEmitter();

  @Output() edit = new EventEmitter<Product>();
  qty: number;

  constructor() { }

  add() {
    this.addEmitter.emit();
    // work with services to not give this component too much responsibility
    // this.whateverService.add(product);
  }
  ngOnChanges() {
    console.log('change detect recalc');
    this.qty = this.getQuantity();
  }
  private getQuantity() {
    let qty = 0;
    this.items.forEach(element => {
      qty += element.qty;
    });
    return qty;
  }

  closeCard() {
    this.close.emit();
  }

  editCard() {
    this.edit.emit(this.product);
  }

}
