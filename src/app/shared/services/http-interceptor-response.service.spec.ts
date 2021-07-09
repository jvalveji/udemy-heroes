import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorResponseService } from './http-interceptor-response.service';

// Se importan los módulos a utilizar en las pruebas
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from '../controls/dialog/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('HttpInterceptorResponseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      providers: [HttpInterceptorResponseService, DialogService]
    });
  });

  it('Servicio HTTP-INTERCEPTOR-RESPONSE del módulo CORE creado!', inject([HttpInterceptorResponseService], (service: HttpInterceptorResponseService) => {
    expect(service).toBeTruthy();
  }));
});
