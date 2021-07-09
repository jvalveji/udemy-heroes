import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAseguradosSearchComponent } from './dialogo-asegurados-search.component';

describe('DialogoFiltroRangoFechasComponent', () => {
  let component: DialogoAseguradosSearchComponent;
  let fixture: ComponentFixture<DialogoAseguradosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAseguradosSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAseguradosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
