import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ItemService } from './../../services/item.service';
import { Item } from './../../models/item';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
// const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'DD MMM YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'inventory-record',
  templateUrl: './inventory-record.component.html',
  styleUrls: ['./inventory-record.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class InventoryRecordComponent implements OnInit, OnChanges {
  @Input('item') item: Item;
  @Input('show-product') showProduct: boolean;
  
  @Output('remove') removeEmitter: EventEmitter<Item> = new EventEmitter();
  @Output('update') updateEmitter: EventEmitter<Item> = new EventEmitter();

  daysUntilExpiry: number;
  showSlider = false;

  constructor(
    private itemService: ItemService
  ) { }

  remove(){
    this.removeEmitter.emit(this.item);
  }
  update(){
    this.updateEmitter.emit(this.item);
  }

  sliderChange(){
    if (this.item.qty === 0) return this.remove();
    this.update();
  }

  reduce(){
    if (this.item.product.qty_type === 'pieces'){
      this.item.qty -= 1 / this.item.product.qty;
      if (Math.round(this.item.qty * 100) / 100 === 0.0)
        this.remove();
      else
        this.update();
    }
    else {
      this.showSlider = !this.showSlider;
    }
  }

  ngOnChanges() {
    this.calcDaysUntilExpiry();
  }

  private calcDaysUntilExpiry() {
    let exp = new Date(this.item.expiry);
    let today = new Date();
    let diffc = exp.getTime() - today.getTime();
    let days = Math.ceil(diffc / (1000 * 60 * 60 * 24));
    this.daysUntilExpiry =  days;
  }

  updateDate(event) {
    const momentDate = new Date(this.item.expiry);
    this.item.expiry = _moment(momentDate).format('YYYY-MM-DD');
    // let product = this.item.product;

    this.calcDaysUntilExpiry();
    this.updateEmitter.emit(this.item);

    // this.itemService.update(this.item.id, this.item).subscribe(item => {
    //   this.item = item;
    //   // this.item.product = product;
    //   this.calcDaysUntilExpiry();
    // });
  }

  ngOnInit() {
  }

}
