// Definición typescript para el módulo AppModule v1.0.0
// Proyecto: Bitzú
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: Equipo TI Plan de Innovación
// Fichero de configuración para evitar en las compilcaciones los warnings 
// de tipo "deep imports" generados por el cambio de versión de Angular y algunos componentes
// Referencia -> https://github.com/petebacondarwin/angular-issue-35615/blob/master/ngcc.config.js

module.exports = {
    packages: {
        'devextreme-angular': {
            ignorableDeepImportMatchers: [
                /devextreme\//
            ]
        },
        'amazing-time-picker': {
            ignorableDeepImportMatchers: [
                /amazing-time-picker\//
            ]
        }
    }
};