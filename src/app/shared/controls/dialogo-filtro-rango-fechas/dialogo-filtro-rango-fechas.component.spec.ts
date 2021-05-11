import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFiltroRangoFechasComponent } from './dialogo-filtro-rango-fechas.component';

describe('DialogoFiltroRangoFechasComponent', () => {
  let component: DialogoFiltroRangoFechasComponent;
  let fixture: ComponentFixture<DialogoFiltroRangoFechasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoFiltroRangoFechasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFiltroRangoFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
