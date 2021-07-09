import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerosEditarComponent } from './generos-editar.component';

describe('GenerosEditarComponent', () => {
  let component: GenerosEditarComponent;
  let fixture: ComponentFixture<GenerosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
