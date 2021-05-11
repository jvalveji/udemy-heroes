import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlsTaskComponent } from './etls-task.component';

describe('EtlsComponent', () => {
  let component: EtlsTaskComponent;
  let fixture: ComponentFixture<EtlsTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlsTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
