// Definición typescript para el módulo RpmRoutingModule v1.0.0
// Proyecto: Bitzu RPM - MEAN
// Definiciones por: Ing. Michael Alexander Jiménez Muñoz <majimenj@ccss.sa.cr>
// Modificado: (08-07-2020) Ing. Michael Alexander Jiménez Muñoz

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes creados

import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
    {
        path: '',
        component: LayoutComponent,

        children: [
            // Componentes
            { path: '', component: HomeComponent },

            // { path: 'not-authorized', component: NotAuthorizedComponent },
            // // Las siguientes 2 lineas de componente no encontrado SIEMPRE van de últimas
            // { path: '404', component: NotFoundComponent },
            // { path: '**', redirectTo: '404' }

            // Módulo agregado por DT Bitzú RPM
            {
                path: 'materiales',
                loadChildren: () =>
                    import('./materiales-servicios/materiales-servicios.module').then(
                        (m) => m.MaterialesServiciosModule
                    )
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(rutas)],
    exports: [RouterModule]
})
export class RpmRoutingModule {}
