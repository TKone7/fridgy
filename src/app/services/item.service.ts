import { Item } from './../models/item';
import { DataService } from './data.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends DataService<Item> {

  constructor(http: HttpClient) {
    super(environment.baseUrl + '/fridges', http);
  }

  initFridge(fridgeId: string){
    this.url = environment.baseUrl + '/fridges/' + fridgeId + '/items';
  }
}
