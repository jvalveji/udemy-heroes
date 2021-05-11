import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGraficosComponent } from './dialog-graficos.component';

describe('DialogGraficosComponent', () => {
  let component: DialogGraficosComponent;
  let fixture: ComponentFixture<DialogGraficosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGraficosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
