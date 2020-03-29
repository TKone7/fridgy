import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'scan-action',
  templateUrl: './scan-action.component.html',
  styleUrls: ['./scan-action.component.css']
})
export class ScanActionComponent  {
  @Output('pressed') scanEmitter = new EventEmitter();

  constructor() { }

  click(){
    this.scanEmitter.emit();
  }

}
