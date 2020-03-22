import { Item } from './../models/item';
import { Fridge } from './../models/fridge';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {  Observable, BehaviorSubject } from 'rxjs';
import { getNumberOfCurrencyDigits, DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class FridgeService extends DataService<Fridge> {

  private currentFridgeSubject: BehaviorSubject<Fridge>;
  public currentFridge: Observable<Fridge>;


  constructor(
    http: HttpClient
  ) {
    super(environment.baseUrl + '/fridges', http);

    this.currentFridgeSubject = new BehaviorSubject<Fridge>(this.getFridgeFromLocal());
    this.currentFridge = this.currentFridgeSubject.asObservable();
  }

  public get currentFridgeValue(): Fridge {
    return this.currentFridgeSubject.value;
  }

  getFridgeFromLocal(){
    let fridge: Fridge = JSON.parse(localStorage.getItem('currentFridge'));
    return fridge;
  }

  setFridgeToLocal(fridge: Fridge){
    if (fridge){
      localStorage.setItem('currentFridge', JSON.stringify(fridge));
      this.currentFridgeSubject.next(fridge);
    }
    else {
      localStorage.removeItem('currentFridge');
      this.currentFridgeSubject.next(null);
    }
  }

}
