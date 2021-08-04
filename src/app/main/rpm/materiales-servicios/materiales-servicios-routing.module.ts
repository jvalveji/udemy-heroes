// Definición typescript para el módulo RpmRoutingModule v1.0.0
// Proyecto: Bitzu RPM - MEAN
// Definiciones por: Ing. Michael Alexander Jiménez Muñoz <majimenj@ccss.sa.cr>
// Modificado: (08-07-2021) Ing. Michael Alexander Jiménez Muñoz

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes creados

import { LayoutComponent } from './layout.component';
import { MaterialesServiciosAltaListarComponent } from './materiales-servicios-alta-listar/materiales-servicios-alta-listar.component';
import { MaterialesServiciosComponent } from './materiales-servicios.component';
import { MaterialesServiciosModificarListarComponent } from './materiales-servicios-modificar-listar/materiales-servicios-modificar-listar.component';
import { MaterialesServiciosBajaListarComponent } from './materiales-servicios-baja-listar/materiales-servicios-baja-listar.component';
import { MaterialesServiciosAccesoListarComponent } from './materiales-servicios-acceso-listar/materiales-servicios-acceso-listar.component';
import { GestionFormulariosCentroLogisticoListarComponent } from './gestion-formularios-centro-logistico-listar/gestion-formularios-centro-logistico-listar.component';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
    {
        path: '',
        component: LayoutComponent,

        children: [
            // Componentes
            { path: '', component: MaterialesServiciosComponent },
            { path: 'alta', component: MaterialesServiciosAltaListarComponent },
            { path: 'modificar', component: MaterialesServiciosModificarListarComponent },
            { path: 'baja', component: MaterialesServiciosBajaListarComponent },
            { path: 'gestion-formulario-centro-logistico', component: GestionFormulariosCentroLogisticoListarComponent },
            { path: 'acceso', component: MaterialesServiciosAccesoListarComponent },
            
            
            // { path: 'acceso', component:  }

            // { path: 'not-authorized', component: NotAuthorizedComponent },
            // // Las siguientes 2 lineas de componente no encontrado SIEMPRE van de últimas
            // { path: '404', component: NotFoundComponent },
            // { path: '**', redirectTo: '404' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(rutas)],
    exports: [RouterModule]
})
export class MaterialesServiciosRoutingModule {}
