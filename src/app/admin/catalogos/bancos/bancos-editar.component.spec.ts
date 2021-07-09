import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BancosEditarComponent } from './bancos-editar.component';

describe('BancosEditarComponent', () => {
  let component: BancosEditarComponent;
  let fixture: ComponentFixture<BancosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BancosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BancosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
