import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoPrinterComponent } from './documento-printer.component';

describe('DocumentoPrinterComponent', () => {
  let component: DocumentoPrinterComponent;
  let fixture: ComponentFixture<DocumentoPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
