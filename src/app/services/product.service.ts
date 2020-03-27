import { GepirSearchService } from './gepir-search.service';
import { Product } from './../models/product';
import { DataService } from './data.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, map, switchMap, flatMap, concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends DataService<Product>{

  constructor(http: HttpClient, private gepirService: GepirSearchService) {
    super(environment.baseUrl + '/products', http, 60 * 60 * 1000);
  }

  // get(id, forceRefresh = false) {
  //   return super.get(id, forceRefresh)
  //   .pipe(
  //     map(product => {
  //       this.gepirService.search(product.barcode)
  //         .subscribe(resp => {
  //           product.parties = resp.parties;
  //         });
  //       return product;
  //     }));
  // }

  // private loadExternalProductData(barcode: string){
  //   this.gepirService.search(barcode).subscribe(response => {
  //     if (response.header.returnCode.code === 0 && response.partiesEmpty === false && response.partiesSingle === true){
  //       return (response.parties || []);
  //     }
  //   });
  // }
  // response => {
  //   if (response.header.returnCode.code === 0 && response.partiesEmpty === false && response.partiesSingle === true){
  //     product.parties = response.parties;
  //   }
// }
}



