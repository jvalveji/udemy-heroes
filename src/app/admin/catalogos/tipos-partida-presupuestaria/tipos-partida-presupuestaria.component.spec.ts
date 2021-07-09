import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPartidaPresupuestariaComponent } from './tipos-partida-presupuestaria.component';

describe('TiposPartidaPresupuestariaComponent', () => {
  let component: TiposPartidaPresupuestariaComponent;
  let fixture: ComponentFixture<TiposPartidaPresupuestariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposPartidaPresupuestariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposPartidaPresupuestariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
