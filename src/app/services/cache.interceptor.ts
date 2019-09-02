import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  /**
   * Clear HTTP cache. If entity param not passed will clear whole cache
   *
   * @param {string} entity Entity to remove.
   */
  clear(entity: string = ''): void {
    if (!entity) {
      this.cache.clear();
    } else {
      this.cache.delete(entity);
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { params } = request;
    if (request.method !== 'GET' || params.get('label') || params.get('name')) {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, event);
        }
      })
    );
  }
}
