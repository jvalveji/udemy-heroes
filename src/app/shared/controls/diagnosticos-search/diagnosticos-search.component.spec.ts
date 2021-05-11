import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticosSearchComponent } from './diagnosticos-search.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DiagnosticosSearchComponent', () => {
  let component: DiagnosticosSearchComponent;
  let fixture: ComponentFixture<DiagnosticosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticosSearchComponent ],
      imports: [ MatIconModule, MatCardModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
