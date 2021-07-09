import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosComponent } from './materiales-servicios.component';

describe('MaterialesServiciosComponent', () => {
  let component: MaterialesServiciosComponent;
  let fixture: ComponentFixture<MaterialesServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
