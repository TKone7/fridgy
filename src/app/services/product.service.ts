import { Product } from './../models/product';
import { DataService } from './data.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends DataService<Product>{

  constructor(http: HttpClient) {
    super(environment.baseUrl + '/products', http, 60 * 60 * 1000);
  }
}



