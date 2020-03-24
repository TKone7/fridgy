import { User } from './../models/user';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { catchError, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<any> {

  constructor(http: HttpClient) {
    super(environment.baseUrl + '/users', http);
  }

  getByEmail(email: string) {
    return this.http.get<User>(this.url + '/email/' + email)
      .pipe(
        catchError(this.handleError)
      );
  }
  headByUsername(username) {
    let params = new HttpParams();
    params = params.append('username', username);

    return this.http.head<any>(this.url, {params, observe: 'response'})
      .pipe(
        map(res => res.status)
      );
  }
  headByEmail(email) {
    let params = new HttpParams();
    params = params.append('email', email);
    return this.http.head<any>(this.url, {params, observe: 'response'})
      .pipe(
        map(res => res.status)
      );
  }
}
