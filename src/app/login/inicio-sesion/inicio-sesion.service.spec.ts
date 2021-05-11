import { TestBed, inject } from '@angular/core/testing';

import { InicioSesionService } from './inicio-sesion.service';
import { HttpClientModule } from '@angular/common/http';

describe('InicioSesionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InicioSesionService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('Servicio INICIO-SESION del componente INICIO-SESION creado!', inject([InicioSesionService], (service: InicioSesionService) => {
    expect(service).toBeTruthy();
  }));
});
