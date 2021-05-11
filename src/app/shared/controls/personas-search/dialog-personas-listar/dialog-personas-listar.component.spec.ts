import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPersonasListarComponent } from './dialog-personas-listar.component';

describe('DialogPersonasListarComponent', () => {
  let component: DialogPersonasListarComponent;
  let fixture: ComponentFixture<DialogPersonasListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPersonasListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPersonasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
