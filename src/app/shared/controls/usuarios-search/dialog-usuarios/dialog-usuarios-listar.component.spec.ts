import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsuariosListarComponent } from './dialog-usuarios-listar.component';

describe('DialogUsuariosListarComponent', () => {
	let component: DialogUsuariosListarComponent;
	let fixture: ComponentFixture<DialogUsuariosListarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DialogUsuariosListarComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogUsuariosListarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
