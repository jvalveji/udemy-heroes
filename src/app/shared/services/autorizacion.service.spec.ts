import { TestBed, inject } from '@angular/core/testing';

import { AutorizacionService } from './autorizacion.service';

// Se importan los módulos a utilizar en las pruebas
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UtilidadesService } from './utilidades.service';
import { DialogService } from '../controls/dialog/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('AutorizacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatDialogModule],
      providers: [AutorizacionService, UtilidadesService, DialogService]
    });
  });

  it('Servicio AUTORIZACION del módulo CORE creado!', inject([AutorizacionService], (service: AutorizacionService) => {
    expect(service).toBeTruthy();
  }));
});
