import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface GepirResponse {
  header: {
    returnCode: {
      code: number
    }
  };
  parties: [{
    name: string;
    address: {
      city: string,
      postalCode: string,
      street: string,
      country: string
    }
  }];
  partiesEmpty: boolean;
  partiesMultiLine: boolean;
  partiesSingle: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GepirSearchService {
  url = 'https://www.gepir.de/rest/search';

  constructor(
    protected http: HttpClient) { }

  search(barcode: string) {
    let params = new HttpParams();
    params = params.append('q', barcode);
    return this.http.get<GepirResponse>(this.url, {params});
  }
}
