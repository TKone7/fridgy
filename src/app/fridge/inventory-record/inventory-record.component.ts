import { Item } from './../../models/item';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'inventory-record',
  templateUrl: './inventory-record.component.html',
  styleUrls: ['./inventory-record.component.css']
})
export class InventoryRecordComponent implements OnInit {
  @Input('item') item: Item;
  @Output('remove') removeEmitter: EventEmitter<Item> = new EventEmitter();

  constructor() { }

  remove(){
    this.removeEmitter.emit(this.item);
  }

  ngOnInit() {
  }

}
