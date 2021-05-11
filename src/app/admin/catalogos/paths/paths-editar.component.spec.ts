import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathsEditarComponent } from './paths-editar.component';

describe('PathsEditarComponent', () => {
  let component: PathsEditarComponent;
  let fixture: ComponentFixture<PathsEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathsEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathsEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
