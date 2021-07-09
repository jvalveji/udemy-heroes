import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantonesEditarComponent } from './cantones-editar.component';
import { MatIconModule } from '@angular/material/icon';

describe('CantonesComponent', () => {
  let component: CantonesEditarComponent;
  let fixture: ComponentFixture<CantonesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CantonesEditarComponent],
      imports: [MatIconModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantonesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
