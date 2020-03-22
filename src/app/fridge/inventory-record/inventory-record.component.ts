import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ItemService } from './../../services/item.service';
import { Item } from './../../models/item';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';


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
    dateInput: 'DD MMM',
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
export class InventoryRecordComponent implements OnInit {
  @Input('item') item: Item;
  @Output('remove') removeEmitter: EventEmitter<Item> = new EventEmitter();

  constructor(
    private itemService: ItemService
  ) { }

  remove(){
    this.removeEmitter.emit(this.item);
  }

  updateDate(event) {
    console.log(event);
    const momentDate = new Date(this.item.expiry);
    this.item.expiry = _moment(momentDate).format('YYYY-MM-DD');
    this.itemService.update(this.item.id, this.item).subscribe(item => {
      this.item = item;
    });
  }

  ngOnInit() {
  }

}
