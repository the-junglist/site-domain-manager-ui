import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Domain } from '../domain';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import { AuthenticationService } from '../authentication.service';

import { environment } from '../../environments/environment';


@Injectable()
export class DomainSearchService {
  domainsUrl = `${environment.api_url}/domains`;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private authenticationService: AuthenticationService
  ) {
    this.handleError = httpErrorHandler.createHandleError('DomainSearchService');
  }

  /* GET domains whose name contains search term */
  searchDomains(term: string): Observable<Domain[]> {
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': this.authenticationService.getAuthorizationHeader()
    }
    var options = {
      'headers': headers,
      'params': new HttpParams().set('name', term.trim())
    };
    return this.http.get<Domain[]>(this.domainsUrl, options)
      .pipe(
        catchError(this.handleError<Domain[]>('searchDomains', []))
      );
  }
}
