import { NotFoundError } from './../common/not-found-error';
import { Query } from './../models/query';
import { TokenExpiredError } from './../common/token-expired-error';
import { UnauthorizedError } from './../common/unauthorized-error';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, retry, map, shareReplay } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AppError } from '../common/app-error';
import { Injectable } from '@angular/core';

/*
@Injectable({
  providedIn: 'root'
})*/
export class DataService<T> {
  constructor(
    protected url: string,
    protected http: HttpClient,
    private expirationMs: number = 0) { }

  httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };

  // caching
  cache = new Map<string, {resource: Observable<T>, expiry: number}>();
  cacheList: {resource: Observable<T[]>, expiry: number};

  protected handleError(error: HttpErrorResponse) {
    // if (error.status === 404)
    //   return throwError( new NotFoundError() );
    // if (error.status === 400)
    //   return throwError( new BadInputError() );
    if (error.status === 401){
      if (error.error.msg === 'Token has expired') return throwError(new TokenExpiredError());
      return throwError(new UnauthorizedError());
    }
    if (error.status === 404){
      return throwError(new NotFoundError());
    }
    return throwError( new AppError(error) );
  }

  getAll(query?: Query, forceRefresh = false) {

    if (
      forceRefresh ||
      !this.cacheList ||
      this.cacheList.expiry <= new Date().getTime()
    ){
      let newExpiry = new Date().getTime() + this.expirationMs;
      let params = new HttpParams();
      if (query) params = params.append('sort_by', query.order.column +  '.' + query.order.dir);
      let res = this.http.get<T[]>(this.url, {params}).pipe(
        shareReplay(1),
        catchError(this.handleError)
      );
      this.cacheList = {resource: res, expiry: newExpiry};
    }
    return this.cacheList.resource;
  }

  get(id, forceRefresh = false) {
    if (
      forceRefresh ||
      !this.cache.has(id) ||
      this.cache.get(id).expiry <= new Date().getTime()
    ){
      let newExpiry = new Date().getTime() + this.expirationMs;
      let res = this.http.get<T>(this.url + '/' + id).pipe(
        shareReplay(1),
        catchError(this.handleError)
      );
      this.cache.set(id, {resource: res, expiry: newExpiry} );
    }
    return this.cache.get(id).resource;
  }

  create(resource){
    return this.http.post<T>(this.url, JSON.stringify(resource), this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  update(id, resource){
    return this.http.put<T>(this.url + '/' + id, JSON.stringify(resource), this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  delete(id){
    return this.http.delete(this.url + '/' + id).pipe(
      catchError(this.handleError), retry(3)
    );
  }

}
