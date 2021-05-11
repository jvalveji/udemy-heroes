import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';

// Se importan los módulos a utilizar en las pruebas
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [DialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Componente DIALOG del módulo CONTROLS creado!', () => {
    expect(component).toBeTruthy();
  });
});
