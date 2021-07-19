// Definición typescript para el módulo AppModule v3.3.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Se incluyen los módulos de Angular Material necesarios
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

// Internacionalización
import localeCRC from '@angular/common/locales/es-CR';
registerLocaleData(localeCRC, 'es-CR');

// Modulos extras
import { FlexLayoutModule } from '@angular/flex-layout'; // Modulo para crear efecto flex
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'; // Modulo para hacer scroll responsive

// Módulo de rutas para el app
import { AppRoutingModule } from './app-routing.module';

// Importación de los módulos del proyecto
import { PipesModule } from './shared/pipes/pipes.module';

// Importación de los componentes a utilizar
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TestComponent } from './test/test.component';
import { DialogComponent } from './shared/controls/dialog/dialog.component';

// Servicios Shared
import { HttpInterceptorRequestService } from './shared/services/http-interceptor-request.service';
import { HttpInterceptorResponseService } from './shared/services/http-interceptor-response.service';

// Servicios de otros módulos
import { PermisosUsuariosService } from './admin/usuarios/permisos-usuarios/permisos-usuarios.service';
import { AplicacionesService } from './admin/catalogos/aplicaciones/aplicaciones.service';
import { PathsService } from './admin/catalogos/paths/paths.service';
import { PerfilesService } from './admin/catalogos/perfiles/perfiles.service';
import { BroadcastService } from './admin/broadcast/broadcast.service';


@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FlexLayoutModule,
		NgxPageScrollModule,
		NgxPageScrollCoreModule,
		PerfectScrollbarModule,
		MatDialogModule,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatInputModule,
		PipesModule,
		AppRoutingModule
	],
	declarations: [
		LayoutComponent,
		HomeComponent,
		AboutComponent,
		TestComponent
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-CR' }, // Service de localización para formatos en español
		{
			provide: HTTP_INTERCEPTORS, // Objeto interceptores http
			useClass: HttpInterceptorRequestService,
			multi: true, // Se habilita que sea multi response/request
		},
		{
			provide: HTTP_INTERCEPTORS, // Objeto interceptores http
			useClass: HttpInterceptorResponseService,
			multi: true, // Se habilita que sea multi response/request
		},
		AplicacionesService,
		PermisosUsuariosService,
		PathsService,
		PerfilesService,
		BroadcastService
	],
	entryComponents: [
		DialogComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
	bootstrap: [
		LayoutComponent
	]
})

export class AppModule { }
