import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlsEditarComponent } from './etls-editar.component';

describe('EtlsEditarComponent', () => {
  let component: EtlsEditarComponent;
  let fixture: ComponentFixture<EtlsEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlsEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlsEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
