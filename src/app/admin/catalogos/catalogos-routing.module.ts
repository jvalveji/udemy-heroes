// Definición typescript para el módulo CatalogosRoutingModule v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes del core base
import { LayoutComponent } from './layout.component';
import { CatalogosListarComponent } from './catalogos-listar/catalogos-listar.component';
import { GenerosEditarComponent } from './generos/generos-editar.component';
import { EstadosCivilEditarComponent } from './estados-civil/estados-civil-editar.component';
import { MediosContactoEditarComponent } from './medios-contacto/medios-contacto-editar.component';
import { UnidadesMedidaEditarComponent } from './unidades-medida/unidades-medida-editar.component';
import { UnidadesProgramaticasEditarComponent } from './unidades-programaticas/unidades-programaticas-editar.component';
import { TiposIdentificacionEditarComponent } from './tipos-identificacion/tipos-identificacion-editar.component';
import { PathsEditarComponent } from './paths/paths-editar.component';
import { PerfilesEditarComponent } from './perfiles/perfiles-editar.component';
import { DiagnosticosComponent } from './diagnosticos/diagnosticos.component';
import { TiposParentescoEditarComponent } from './tipos-parentesco/tipos-parentesco-editar.component';
import { ServiciosEditarComponent } from './servicios/servicios-editar.component';
import { PaisesEditarComponent } from './paises/paises-editar.component';
import { ProfesionalesEditarComponent } from './profesionales/profesionales-editar.component';
import { ProvinciasEditarComponent } from './provincias/provincias-editar.component';
import { DistritosEditarComponent } from './distritos/distritos-editar.component';
import { CantonesEditarComponent } from './cantones/cantones-editar.component';
import { EspecialidadesEditarComponent } from './especialidades/especialidades-editar.component';
import { TiposFuncionarioEditarComponent } from './tipos-funcionario/tipos-funcionario-editar.component';
import { GrupoRhComponent } from './grupo-rh/grupo-rh.component';
import { JobsEditarComponent } from './jobs/jobs-editar.component';
import { EtlsEditarComponent } from './etls/etls-editar.component';
import { UnidadesProgramaticasInicioSesionComponent } from './unidades-programaticas-inicio-sesion/unidades-programaticas-inicio-sesion.component';
import { DocumentoPrinterComponent } from './documento-printer/documento-printer.component';
import { PermisosEditarComponent } from './permisos/permisos-editar.component';
import { PrinterConfigComponent } from './printer-config/printer-config.component';
import { TiposMonedaEditarComponent } from './tipos-moneda/tipos-moneda-editar.component';
import { BancosEditarComponent } from './bancos/bancos-editar.component';
import { TiposPartidaPresupuestariaComponent } from './tipos-partida-presupuestaria/tipos-partida-presupuestaria.component';

// Se importa el servicio de validación de acceso a las rutas
import { AutorizacionService } from './../../shared/services/autorizacion.service';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{
		path: '', component: LayoutComponent, canActivateChild: [AutorizacionService],  // Path para el layout que dibuja el sidenav
		children: [
			{ path: '', component: CatalogosListarComponent },
			{ path: 'estados-civil', component: EstadosCivilEditarComponent },
			{ path: 'generos', component: GenerosEditarComponent },
			{ path: 'medios-contacto', component: MediosContactoEditarComponent },
			{ path: 'tipos-identificacion', component: TiposIdentificacionEditarComponent },
			{ path: 'unidades-programaticas', component: UnidadesProgramaticasEditarComponent },
			{ path: 'unidades-medida', component: UnidadesMedidaEditarComponent },
			{ path: 'perfiles', component: PerfilesEditarComponent },
			{ path: 'paths', component: PathsEditarComponent },
			{ path: 'diagnosticos', component: DiagnosticosComponent },
			{ path: 'tipos-parentesco', component: TiposParentescoEditarComponent },
			{ path: 'servicios', component: ServiciosEditarComponent },
			{ path: 'paises', component: PaisesEditarComponent },
			{ path: 'profesionales', component: ProfesionalesEditarComponent },
			{ path: 'provincias', component: ProvinciasEditarComponent },
			{ path: 'distritos', component: DistritosEditarComponent },
			{ path: 'cantones', component: CantonesEditarComponent },
			{ path: 'especialidades', component: EspecialidadesEditarComponent },
			{ path: 'tipos-funcionario', component: TiposFuncionarioEditarComponent },
			{ path: 'grupo-rh', component: GrupoRhComponent },
			{ path: 'jobs', component: JobsEditarComponent },
			{ path: 'etls', component: EtlsEditarComponent },
			{ path: 'unidades-programaticas-inicio-sesion', component: UnidadesProgramaticasInicioSesionComponent },
			{ path: 'documento-printer', component: DocumentoPrinterComponent },
			{ path: 'permisos', component: PermisosEditarComponent },
			{ path: 'printersconfig', component: PrinterConfigComponent },
			{ path: 'tipos-moneda', component: TiposMonedaEditarComponent },
			{ path: 'bancos', component: BancosEditarComponent },
			{ path: 'partidas-presupuestarias', component: TiposPartidaPresupuestariaComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule]
})

export class CatalogosRoutingModule { }
