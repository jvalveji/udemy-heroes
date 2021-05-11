// Definición typescript para el módulo AppModule v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (09-03-2020) Ing. Dagoberto Gómez Jiménez

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module'; // Carga el módulo inicial
import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)

// Valida si es ambiente de producción o no
if (environment.production) {
  enableProdMode();
}
// Publica el módulo
platformBrowserDynamic().bootstrapModule(AppModule);
