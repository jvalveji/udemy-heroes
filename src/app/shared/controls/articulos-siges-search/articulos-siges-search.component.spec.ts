import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosSigesSearchComponent } from './articulos-siges-search.component';

describe('ArticulosSigesSearchComponent', () => {
  let component: ArticulosSigesSearchComponent;
  let fixture: ComponentFixture<ArticulosSigesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticulosSigesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticulosSigesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
