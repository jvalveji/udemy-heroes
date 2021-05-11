import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistritosEditarComponent } from './distritos-editar.component';

describe('DistritosEditarComponent', () => {
  let component: DistritosEditarComponent;
  let fixture: ComponentFixture<DistritosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistritosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistritosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
