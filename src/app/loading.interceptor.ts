import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from './services/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private requestCount: number = 0;

  constructor(private spinnerService: SpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.requestCount++;
    this.spinnerService.startLoading()
    return next.handle(request).pipe(
      finalize(() => {
        this.requestCount--
        if (this.requestCount === 0)
          this.spinnerService.stopLoading()
      })
    );
  }
}
