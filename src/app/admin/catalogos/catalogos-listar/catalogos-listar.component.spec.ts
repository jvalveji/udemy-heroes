import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogosListarComponent } from './catalogos-listar.component';

describe('CatalogosListarComponent', () => {
  let component: CatalogosListarComponent;
  let fixture: ComponentFixture<CatalogosListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
