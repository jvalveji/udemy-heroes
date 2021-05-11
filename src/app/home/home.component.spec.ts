import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

// Se importan los módulos a utilizar en las pruebas
import { NgxPageScrollModule, PageScrollService, PageScrollConfig } from 'ngx-page-scroll'; // Modulo y servicio para realizar scroll tipo smooth

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPageScrollModule],
      declarations: [ HomeComponent ],
      providers: [PageScrollService, PageScrollConfig]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Componente HOME del módulo APP creado!', () => {
    expect(component).toBeTruthy();
  });

  /*it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    //expect(compiled.querySelector('h1').textContent).toContain('Bienvenido a la aplicación!!');
    expect(compiled.querySelector('a').textContent).toContain('Iniciar sesión');
  }));*/
});
