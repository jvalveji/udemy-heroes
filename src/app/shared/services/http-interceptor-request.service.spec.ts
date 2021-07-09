import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorRequestService } from './http-interceptor-request.service';

describe('HttpInterceptorRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpInterceptorRequestService]
    });
  });

  it('Servicio HTTP-INTERCEPTOR-REQUEST del módulo CORE creado!', inject([HttpInterceptorRequestService], (service: HttpInterceptorRequestService) => {
    expect(service).toBeTruthy();
  }));
});
