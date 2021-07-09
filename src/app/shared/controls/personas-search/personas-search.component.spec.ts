import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasSearchComponent } from './personas-search.component';

describe('PersonasSearchComponent', () => {
  let component: PersonasSearchComponent;
  let fixture: ComponentFixture<PersonasSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonasSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
