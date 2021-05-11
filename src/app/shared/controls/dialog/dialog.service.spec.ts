import { TestBed, inject } from '@angular/core/testing';

import { DialogService } from './dialog.service';

// Se importan los módulos a utilizar en las pruebas
import { MatDialogModule } from '@angular/material/dialog';

describe('DialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [DialogService]
    });
  });

  it('Servicio DIALOG del componente CONTROLS creado!', inject([DialogService], (service: DialogService) => {
    expect(service).toBeTruthy();
  }));
});
