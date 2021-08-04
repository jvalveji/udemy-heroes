import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Se incluye el módulo de ruteo
import { LayoutComponent } from './layout.component';

// Se importan los módulos a utilizar en las pruebas
import 'hammerjs'; // Libreria para renderizar algunos controles de angular material 2
import { NgxPageScrollModule, PageScrollService, PageScrollConfig } from 'ngx-page-scroll'; // Modulo y servicio para realizar scroll tipo smooth
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                NgxPageScrollModule,
                RouterTestingModule
            ],
            providers: [PageScrollService, PageScrollConfig],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    it('Componente LAYOUT del módulo ADMIN creado!', async(() => {
        const fixture = TestBed.createComponent(LayoutComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
