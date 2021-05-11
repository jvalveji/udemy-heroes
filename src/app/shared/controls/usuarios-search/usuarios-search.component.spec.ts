import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSearchComponent } from './usuarios-search.component';

describe('UsuariosSearchComponent', () => {
	let component: UsuariosSearchComponent;
	let fixture: ComponentFixture<UsuariosSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UsuariosSearchComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsuariosSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
