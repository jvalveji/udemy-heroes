# Changelog

Todos los cambios para este proyecto serán documentados en este archivo.

El formato de este documento está basado en [Mantenga un Changelog](http://keepachangelog.com/es-ES/1.0.0/) y se adhiere a [Semantic Versioning](http://semver.org/spec/v2.0.0.html) para el manejo de las versiones.

# Secciones de este documento

- **Added**: Se detallan las funcionalidades nuevas.
- **Changed**: Indica cambios en las funcionalidades existentes.
- **Deprecated**: Se establece una característica o funcionalidad cuando está obsoleta y que se eliminará en las próximas versiones.
- **Removed**: Para las características en desuso que se eliminaron en esta versión.
- **Fixed**: Se indica para corrección de errores.
- **Security**: En caso de vulnerabilidades se indican en esta sección.

## [Unreleased]

- Inclusión y manejo de **sesiones de usuario** en la aplicación.
- Manejo de tareas automáticas (_task_) para uso en modo **cluster**.
- Adaptar el uso de sockets para uso en modo **cluster**.
- Mensajería instantánea tipo *Chat* entre usuarios.
- Componente generador de códigos QR y códigos de barras.

# [10.3.0] 03-08-2020 (ACTUAL)

## Added

- Al proyecto **rest-api** se le agregan nuevos ficheros de configuración para cada ambiente a desplegar; y se adapta el fichero de configuración pre-existente (*config/config.js*).
- Se realiza la migración del proyecto para usar **[esLint](https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration)** en lugar de tslint en las validación tanto para typescript como para javascript.

## Changed

- Se ajustan los ficheros **environments** del proyecto *Angular* en su formato de presentación.
- Se modifica la validación que permite iniciar tanto el *servidor rest como los sokets* sobre los protocolos **HTTP/HTTPS**; esto basado en los cambios al fichero de configuración del proyecto (*config/config.js*).
- Se actualizan algunos servicios de catálogos generales para omitir/agregar la propiedad **providedIn** según importancia de uso para cualquier aplicación Angular.
- Se actualizan los **pipes** del proyecto angular agregando la propiedad *pure* en *true*; de esta forma se optimiza su [uso](https://netbasal.com/optimizing-the-performance-of-your-angular-application-f222f1c16354).

# [10.2.2] 29-07-2020

## Changed

- Se ajusta el fichero de configuración de **jake (jakefile)** para manejar la memoria del motor V8 para node y adaptarla cada vez que se realiza un despliegue (*deploy*) de la aplicación cliente angular.
- Se modifican los ficheros de configuración para **typescript (tsconfig.json y tsconfig.app.json)** para optimizar los proceso de *build y run* durante el desarrollo y despliegue de la aplicación.

# [10.2.1] 29-07-2020

## Changed

- Se ajusta el fichero de configuración para **[typescript (tconfig.json)](https://angular.io/guide/typescript-configuration)** del proyecto base para migrarlo a los nuevos requerimientos de angular en el *[build](https://angular.io/guide/migration-update-module-and-target-compiler-options#update-module-and-target-compiler-options-migration)* del proyecto.
- Se corrige fichero de configuración de **jake (jakefile)** debido al cambio de la configuración de typescript por lo que los bundles generados tienen nombres distintos.

## Fixed

- Se agrega el módulo **NgxPageScrollCoreModule** a la importación de modulos del *module* principal (app.module) del proyecto base ya que no se habia incluido cuando se realizó el upgrade de dicho módulo.

# [10.2.0] 28-07-2020

## Added

- Se agrega [jake](https://jakejs.com/index.html) como herramienta de *despliegue* para las aplicaciones **Angular**.
- Se agrega el catálogo de **partida presupuestaria** y su respectivo mantenimiento en el proyecto base.
- Se agrega *spinner* para mostrar un "cargando" cada vez que se obtiene un nuevo módulo desde el servidor debido al método *lazy-loading*.

## Fixed

- Se corrige problema en la validación de **token de seguridad** cuando se ha vencido el tiempo al usuario; ya que no estaba enviando el menjsae de error ni desplazando al usuario a la ventana de logueo.
- Se corrigen problemas de carga de algunos servicios desde el módulo principal del proyecto (**app.module.ts**), esto debido al método de carga diferida implementado.

# [10.1.0] 08-07-2020

## Changed

- Se modifica la estructura del proyecto **Angular** como la del prpyecto **Express** para ajustarla a los cambios y optimizaciones de código realizadas a la plataforma MEAN.
- se modifica el **home** de todos los módulos del proyecto Angular con los nuevos estilos de tarjetas.
- Se modifica todo el proyecto para que la carga de los distintos módulos se hagan bajo el patrón de diseño conocido como **carga diferida (_lazy loading_)**.
- Se modifican los ficheros de rutas de todos los módulos para ajustarlos en la forma de como son cargados por Angular a la ruta padre de la aplicación (**forChild**).
- Se modifican los ficheros de configuración (**_Environments_**) y se establece una ruta base llamada **main** para identificar la url principal que utilizarán los servicios angular para conectar con el servicio rest de la aplicación.

## Removed

- Se omite el módulo de **inventarios** en el proyecto base.

# [9.1.0] 29-05-2020

## Added

- Se realiza la actualización de la versión de **Angular** pasando de la *8.2.3* a la **_9.1.1_**; además de actualizarse todas las dependencias del proyecto por las versiones más recientes disponibles. Para más detalles de la actualización en cada proyecto se sugiere seguir la guia dada por los desarrolladores de [Angular](https://angular-update-guide.firebaseapp.com/).
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.
- Se agregan nuevas configuraciones al **angular.json** para el empaquetado del *index.html* y la hoja de estilos principal del proyecto *styles.scss*. Este cambio aparte de modificar los estilos existentes provoca hacer un cambios en el despliegue de las aplicaciones por ambiente **generando un nuevo index.html y styles.scss**.
- Se agrega un nuevo parámetro a los ficheros de configuración del proyecto Angular (**environments**) para agregar la referencia del sitio para recursos Web (*webkit*) dependiendo del ambiente que se requiera acceder.
- Se agrega una nueva carpeta al proyecto para definir scripts de código que se usarán en el proyecto como complemento de **procesos y/o tarea complejas y que requieran del servidor más uso de CPU, memoria, disco, etc**.

## Changed

- Se realizan modificaciones al código fuente agregando cambios en la defición de las variables de los objetos en javascript (pasado las definiciones de _VAR_ a _LET o CONST_); esto con el fin de mejorar el rendimiento de las aplicaciones. Para más detalles ver la siguiente referencia: [Avoiding Memory Leaks in NodeJS: Best Practices for Performance](https://blog.appsignal.com/2020/05/06/avoiding-memory-leaks-in-nodejs-best-practices-for-performance.html)
- Se cambian todos los modelos de la base de datos MongoDB para que apunten a la nueva configuración del proyecto base llamada **mixin**.
- Se cambian todos los servicios angular para que apunten a la nueva configuración del proyecto base llamada **mixin**.
- Se modifica el ruteo de las aplicaciones Arca - MEAN en general **agregando en el path el nombre del sistema Arca que esta homologado en el balanceador F5**; de esta forma cada aplicativo debe agregar su propio contexto en la ruta path (**este cambio aplica para la aplicación cliente como a los servicios rest**).
- Se modifican **las referencias al sitio de recursos compartidos (arcawebkit.ccss.sa.cr)** para ahora utilizar los nuevos DNS's correspondientes a los servidores de recursos Web ruteados por medio del balanceador F5 y ubicados en CODISA.

## Fixed

- Se corrigen problemas de acceso a propiedades de objetos javascript en los cuales el dato era nulo; esto aplica para el proceso de **carga de archivos y para el servicio de monitoreo (*heatlh*)** de los componentes Arca.

# [8.8.0] 30-04-2020

## Added

- Se agrega un nuevo componente llamado **Health Services** que permite de una forma visual ver el estado actual de los distintos componentes de la plataforma Arca.
- Se crean las **tareas programadas** que realicen una revisión de los distintos componentes de las aplicaciones que conforman la plataforma Arca y brinden alertas por medio de un correo electrónico a los encargados de cada proyecto.
- Se incluye un nuevo archivo de configuración en los **servicios rest** que permite ubicar todos los componentes de todas las aplicaciones Arca y asi realizar el monitoreo de estado de los mismos con la funcionalidad de *Health Services*.
- Se agrega un nuevo fichero **index.prod.html** para el ambiente de **PRODUCCIÓN** con los nuevos enlaces al servidor de recursos Web (*webkit*) bajo el nuevo formato de acceso por medio del balanceador (F5).
- Se agrega un nuevo servicio interno llamado **mailService** del lado del servidor rest-api para el **envio de mensajes de correo electrónico** a traves del servidor de correo institucional; lo que permite enviar *emails* a uno o varios destinatarios de forma simultánea. Este servicio se une al ya existente llamado **mailPhpListService** que permite el envio de correos electrónicos utilizando plantillas disponibles en la *plataforma de PhpList*.
- Se agrega en el servicio de **utilidades de los servicios rest** 2 nuevas funcionalidades para el manejo de directorios:
  - **directorySize**: Permite obtener el tamaño de un directorio (en kb, MB, GB) en el servidor a partir de una ruta dada.
  - **directoryDeleteRecursive**: Permite eliminar un directorio en el servidor a partir de una ruta dada.
- Se agregan 2 nuevos catálogos generales y su respectivo mantenimiento:
  - **Bancos**: Listado de algunos bancos nacionales (publicos y privados) dado por el BCCR.
  - **Tipos de moneda**: Listado de los tipos de moneda de algunas regiones del mundo dadas por el BCCR.
- Se agrega un nuevo mantenimiento llamado **Tipos de cambio** que permite visualizar los tipos de cambio diario e históricos del dólar con respecto al colon costarricense en distintas entidades finacieras nacionales; además de mostrar indicadores económicos dados por el *servicio Web público del BCCR*.

## Changed

- Se modifica el manejo de las **tareas programadas en el servidor de servicios rest** para modularizar cada tarea en ficheros separados y con esto mejorar el mantenimiento de los mismos.
- Se ajusta el fichero de configuración de los **servicios rest (config.js)** para que cierta información de los sistemas sea obtenida del nuevo archivo de configuración tipos *JSON* llamado *arcaMeanConfig.json*.
- Se modifica el componente y servicio rest de **ejecución de transformaciones en el servidor de Pentaho (ETL's)** para cambiar la formna en como era llamada la ejecución de las transformaciones a una más simple por medio del api proporcionado por Pentaho. Además se agregó la posibilidad de consumir transformaciones que retornan datos en *crudo tipo Web service* para respuestas **JSON y XML**.
- Se modifica el componente y servicio rest de **ejecución de trabajos en el servidor de Pentaho (JOB's)** para cambiar la formna en como era llamada la ejecución de las transformaciones a una más simple por medio del api proporcionado por Pentaho.

## Fixed

- Se corrige un **bug** detectado en los **servicios Rest en general** que consiste en que cuando hay uso de ciclos (*loops*) y dependiendo de la cantidad de solicitudes tipo *REQUEST* que se utilicen dentro de estos, puede llegar a provocar errores de *negación por DNS* o *timeouts*. Por lo que se incrementa la cantidad de memoria que utiliza el proceso que controla los hilos de los ciclos a nivel de sistema operativo.
- Se corrige problema en los **permisos de usuario local** cuando se cargaba la lista de permisos asignados debido al tiempo de carga, por lo que se agregó un _timeout_ más prolongado para que la carga se lleve a cargo.

# [8.7.0] 13-12-2019

## Added

- Se modifica el acceso a los **servicios MISE pasando de WSDL a Restful**; por lo que se ajustan los controladores _UsuariosController_ y _LoginController_.
- Se incluye un indicador visual para que los usuarios sepan en que ambiente se encuentran; esto aplica para todos los ambientes **menos** producción.
- Se agrega propiedad *sameSite=lax* a la generación de cookies desde el servidor debido a las próximas actualizaciones del navegador Chrome con respecto al tratamiento de cookies *(<https://web.dev/samesite-cookies-explained/)>*.
- Se agrega validación que permite seleccionar los permisos habilitados para el perfil del usuario; además de validar si la respuesta es una cadena de texto o un JSON.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Changed

- Se actualizan las direcciones URL de los nuevos servicios **rest de MISE** en el fichero de configuración del servidor api.

## Fixed

- Se corrigen problemas presentados en las conexiones a las base de datos **Mongo**; se agrega un interceptor de errores (_ catch_) que elimina dicho error (_UnhandledPromiseRejectionWarning_).
- Se corrigen problemas presentados en las conexiones a las base de datos **SQL Server**; se cambia las configuraciones de conexión debido a la actualización de las librerias **_Sequelize_ y _Tedious_** en sus últimas versiones.
- Se corrige en el *home* del módulo **administrador** el nombre del permiso para mostrar la tarjeta para la funcionalidad de carga del SIGES (fichero Excel) al sistema Arca, ya que no permitia acceder a la opción aún cuando el usuario tenía el permiso.
- Se corrige en el componente **JobsTaskComponent** la varible que muestra la barra de estado del proceso; ya que estaba mal referenciada.
- Se corrige problema en el componente **ProcesoSIGESComponent** al tratar de acceder por medio del *ViewChild* al componente de Jobs-Task que se encarga de ejecutar *Jobs* en el servidor de *Pentaho*.
- Se corrige llamado al **servicio restApi de Pentaho** para la ejecución de *JOBS y ETL's* debido a que los nombres de los parámetros de usuario y contraseña estaban incorrectos.

# [8.6.1] 23-10-2019

## Added

- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Fixed

- Se corrige el proceso de **restablecer contraseña** para los usuarios *MISE* cambiando los mensajes que se envian por medio del correo electrónico debido a que se enviaba por un error el nombre de usuario, el cúal no le correrspondia a la persona.
- Se corrige el servicio que envia correo electrónicos por medio de la plataforma de __*PhpList*__ ya que el proceso "se pegaba" cuando emitia el correo al destinatario y no retornaba la respuesta de envío.

# [8.6.0] 21-10-2019

## Added

- Se agrega el servicio *rest* que permite la creación de productos asociando un artículo *SIGES* al mismo, esto en la colección de **productos**.
- Se incluyen los servicios *rest* que permiten las consulta del inventario por los siguientes parámetros:
  - Por servicio
  - Por producto
  - Por artículo *SIGES*
- Se agrega el servicio *rest* para la inserción de un artículo *SIGES* directamente al **inventario**.
- Se incluye un servicio en **utilidades** llamado *CurrentAge* que permite obtener la edad de una persona apartir de la fecha de nacimiento y la fecha actual. Ejemplo: *10* años *03* meses *05* días.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Changed

- Se modifica el catálogo de **tipos movimiento inventario** para eliminar el manejo por unidad programática y establecerlo por servicio y la aplicación.
- Se actualiza la ruta del los servicios *rest* para el manejo de **inventarios**.

## Fixed

- Se corrige validación de los **permisos de los usuarios** en algunos catálogos del proyecto base ya que se estaba utilizando una validación desactualizada y por lo tanto no funcionaba.
- Se corrigen referencias de variables no declaradas en el código fuente.

# [8.5.0] 26-09-2019

## Changed

- Se actualizan los estilos de los **HOMES** para adaptarlos con a los temas *claro y oscuro* de la plataforma Arca - MEAN.
- Se modifica la funcionalidad del sidenav que permite el cambio de **TEMAS (claro/oscuro)** para incluir los estilos que necesita cada tema cuando se realiza el cambio.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Fixed

- Se corrige error generado en las conexiones mongo agregando la opción **useUnifiedTopology** cuando se establece la conexión a la base de datos (esto debido a la última actualización de la librería *mongoose*).
- Se corrige el **inicio de sesión** con la validación del MISE cuando retorna el error de cambio de contraseña para el usuario; debido a que no estaba reconiciendo dicho mensaje por lo que noi estaba redigiendo al usuario a la página de cambio de contraseña.

# [8.4.0] 12-09-2019

## Added

- Se agregan al catálogo de **artículos** las siguientes propiedades contenidas en el fichero Excel del _SIGES_:
  - Categoría
  - Clasificador del gasto
  - Partida efectivo
  - Partida no efectivo
- Se crea el catálogo llamado **catalogo-siges-categorias-tipos** para el manejo de las categoría de adquisión de artículos del _SIGES_.

## Changed

- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Fixed

- Se corrige el _JOB_ que se encarga del proceso de cargar los datos correspondientes al catálogo del _SIGES_ mediante el fichero Excel; esto por cuanto las referencias a los catálogos de clases, subclases y grupos no estaban actualizados.

# [8.3.0] 28-08-2019

## Added

- Se agrega la posibilidad al usuario para que pueda alternar entre los temas **claro y oscuro** en las aplicaciones Arca; dicha preferencia es almacenada en base datos.
- Se crea un servicio _middleware_ llamado **miseService** para el consumo (de forma genérica) de los **nuevos servicios MISE-Restful**.
- Se crea un servicio _middleware_ llamado **jsonWebTokenCCSSService** para el manejo de llaves (JWT) generadas por el servicio de la CCSS para el consumo de otros servicios caja de forma segura.

## Changed

- Se ajustan las hojas de estilo del proyecto base, pasandolas de extensión de *CSS* a **_SCSS_** (esto en todos los componentes Angular).
- Se optimiza la **búsqueda de usuarios** por medio del control *Usuarios-Search* agregando la opción de filtrado por el nombre de usuario.

## Fixed

- Se corrigen problemas con el componente de **búsqueda de artículos** que no permitia la carga de datos.
- Se actualiza el código fuente en los llamados a funciones ya *depreciadas* en las nuevas versiones de algunos módulos NPM (Ej. Buffer, mongo.update).
- Se corrigen las URL's de los **servicios de impresión**; esto en todos los ambientes de la aplicación.
- Se corrige problema en la **búsqueda de usuarios** cuando desplega la lista de usuarios encontrados ya que al seleccionar un usuario no retornaba información.
- Se corrige problema de redireccionamiento desde la **página de login a la página de cambio de contraseña** ya que la ruta no era la correcta.
- Cambios en funciones __deprecidas__ en el consumo de datos desde la base de datos MongoDB por funciones más recientes.

# [8.2.0] 01-08-2019

## Added

- Se crean *templates* para el manejo de historias de usuario (issues) en la plataforma del arcagitlab.
- Se agrega la funcionalidad que permite el **cambiar contraseña** (para usuarios MISE y NO MISE) dentro de cada perfil de usuario logueado.
- Se agrega la funcionalidad que permite el **restablecer contraseña** (para usuarios MISE y NO MISE); esto en el módulo administrador.
- Se incluye un nuevo componente llamado **UsuariosSearchComponent** que permite la búsqueda de usuarios desde la base de datos core.
- Se crea un nuevo servicio del lado del servidor de servicios REST llamado **mailPhpListService** que permite enviar mensajes de correo electrónico desde la plataforma Arca mediante el uso de plantillas con **PHPList**.
- Se crea un nuevo servicio del lado del servidor de servicios REST llamado **messagePhoneService** que permite enviar mensajes de texto desde la plataforma Arca mediante el uso del sistema de envío de mensajería de la CCSS
- Se agrega al **servicio de utilidades** en el servidor de servicios rest llamada **is Email** que permite validar si el dato asociado a un correo electrónico es válido. También se agrega a este mismo servicio la función llamada **passwordGenerator** que permite generar contraseñas de tamaño *n* de forma aleatoria.
- Se incluye el uso de hojas de estilo (**SASS**) dentro del proyecto base.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Changed

- Se modifica la consulta que obtiene los permisos de las aplicaciones de la plataforma **Arca - MEAN** para que si una aplicación es MISE **_también se obtengan los del sistema base (arca.bcore)_** que posea el usuario para dicha aplicación donde se esta logueando.
- Se modifican los *templates* para la creación de *merge request* en la plataforma del arcagitlab (masters, diseño y desarrolladores).
- Se modifica el *sidenav* para ajustar el menu colapsable de la izquierda y que en **TODOS los layouts** de los módulos puedan manejar independientemente opciones para dicho menú.
- Se trabaja en la modificación del componente de cambio de contraseña y se agrega la posibilidad de cambiarla para *usuarios locales* también y no solo MISE.

## Removed

- Se elimina el componente **sidenav-submenu** del módulo de controles por lo que solo se utilizará el *sidenav*.

# [8.1.0] 05-07-2019

## Added

- Se actualiza el __sidenav (toolbar general)__ para agregar el icono de acceso al módulo de inventarios así como una barra divisoria entre los accesos al sistema base y los accesos propios de cada aplicación.
- Se agrega una nueva funcionalidad al servicio de utilidades  del Angular (_utilidades.service.ts_) llamada __ClearString__ que permite cambiar todos los caracteres extraños, tíldes y "ñ" en una cadena de texto.

## Changed

- Se modifican los componentes __layout__ que muestran el panel colapsable de opciones en todas las vistas de la herramienta para eliminar todas las opciones y dejarlo limpio, esto permitirá darle otro uso a dicho panel posteriormente.
- Se modifican los __PIPES__ para el filtrado de listas agregando el llamado a la función _ClearString_ del servicio de utilidades permitiendo filtrar las listas cuando las descripciones o nombres __poseen caracteres especiales, tíldes o "ñ"__.
- Se actualiza la versión del aplicativo y la documentación contenida en el control de cambios (__CHANGELOG.md__).

## Fixed

- Se modifican los módulos de rutas (__routing.module.ts__) de core base para corregir el llamado al servicio de autorización de rutas; eliminando re-llamados innecesarios a dicho servicio.
- Se aplican reglas de estandarización (__tabulación y espaciado__) algunos ficheros de código fuente.
- Se modifica el servicio de autorización de rutas (__autorizacion.service.ts__) para que cuando el usuario NO esta autorizado y muestre el mensaje, no cambie toda la ruta donde se encuentra el usuario y este pueda retornar a la vista anterior y no a la raíz de dicha ruta.

# [8.0.0] 25-06-2019

## Added

- Se crea un servicio rest en utilidades llamado __"/token/auth-arca/decode"__ que permite la decodificación  de tokens
generados por el login para aplicaciones arca llamado __"/auth-arca/:app"__.
- Se crea un nuevo componente llamado **NotAuthorizedComponent** que se usa parta indicar al usuario que no posee permisos para acceder a una determinada ruta (vista/página).
- Se crea un decorador llamado __Activate__, el cuál se utiliza como encabezado de los componente Angular para luego validar si el  usuario posee o no permisos de acceso a dicho componente. En dicho decorador se indicada el permiso para el componente (puede ser el permiso local o permiso __MISE__).

## Changed

- Se actualiza la versión Angular del proyecto pasando de la _7.2.15_ a las nueva versión __8.0.2__.
- Se modifican los componentes donde existe el decorador __@ViewChild__ para agregar la propiedad _static = false_ y ajustarlo a la nueva versión __v8.0.2__.
- Se mejora la documentación interna del __servicio de impresión__ y se cambia el mapeo de las impresiones de tiquetes por comprobantes.
- Se modifica el servicio rest llamado __arcaAcceso__ (utilizado para conectar aplicaciones EDUS) para ue retorne en la lista de permisos
los nombres de estos tal cuál MISE los retorna y se omite el uso de los ID's mongo para dicho fin.
- Se modifica el login de usuarios para agregar un nuevo login que permita a otra aplicaciones arca simular el proceso de loguearse a la plataforma Arca - MEAN y poder obtener un token (JWT) con información de la sesión del usuario.
- Se cambia el objeto que posee la lista de permisos para que devuelva los nombres de los permisos y no ID´s mongo por lo que las validaciones son localmente, mediante
el uso de la directiva __arcaAccesoPermiso__.
- Se modifica el servicio Angular de autorización (__autorizacion.service.ts__) para agregar la validación que permite determinar si un usuario posee permisos para acceder a un componente especifico; esto por medio del decorador __Activate__ de cada componente.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Fixed

- Se corrige el componente para el manejo de fechas __TimePickerComponent__ y se le incluyen cambios en su funcionamiento.
- Se corrige el servicio rest que retorna la __hora y fecha del servidor (NTP)__ para que retorne la hora local y no el UTC (-6H).
- Se corrige el llamado de la función javascript para el parseo de cadena de texto a números __parseInt__, agregándole el valor _RADIX_ en 10; esto para las conversiones de todo número a su base numérica 10.

# [7.2.0] 07-06-2019

## Added

- Se agrega un fichero llamado __env-api.js__ al proyecto que permite establece el ambiente donde se ejecutará eñ servidor de servicios rest; de esta forma no se debe alterar el fichero __server.js__ para establecer el ambiente en el servidor.
- Se agrega el componente para manejo de fechas llamado __TimePickerComponent__ a los componentes _shared_ del proyecto base.
- Se agrega el componente llamado __SignatureFieldComponent__ que permite capturar eventos tipo "draw" desde la pantalla y transformarlos en datos (muy útil para firmas de usuario).
- Se agrega validación en las directivas de seguridad de __permisos__ para que sea utilizada por aplicaciones de terceros y pueda validar contra los permisos __MISE__ en su forma nativa.
- Se agrega el componente que permite la __configuración de las impresoras__ locales del cliente. Además se actualiza el servicio de impresión con los últimos cambios disponibles y se agrega en el fichero de configuración de cada ambiente en el proyecto Angular.
- Se agrega un nuevo componente llamado __viewfinder__ que es un visor para recursos almacenados en la base de datos mongo con GridFS.
- Se agrega al fichero de configuración de los servicios rest para cada ambiente la referencia para las conexiones a las bases de datos relacioales Microsoft SQLServer. Además se agrega el fichero de configuración para este mismo fin utilizando el módulo __Sequelize__.
- Se actualiza el fichero __package.json__ con las últimas versiones disponibles de los módulos del proyecto.

## Changed

- Se modifica el mantenimiento para __generar tokens__ en la plataforma Arca - MEAN eliminando el tope de _60_ para la caducidad del token y dejarlo a libertad del usuario.
- Se modifica el componente para el manejo de reportes de la plataforma Pentaho llamado __ReportsComponent__ permitiendo poder acceder por _PDF_ o descargando estos en otros formatos (_txt, html, excel_).
- Se actualizan las deficiones de los estándares de __tabulación del código fuente__ en el proyecto; esto en los ficheros _lint_ y en la configuración del editor de código.

## Fixed

- Se corrige la función que establece el tiempo de vida de los __jsonWebToken (JWT)__ ya que el cálculo para obtener el dato del tiempo en el rango _por años_ era erróneo.

## Removed

- Se remueve del proyecto el fichero de utilidades en los servicios rest; esto por que se encontraba __depreciado__ desde la versión anterior. Las funcionalidades de este fichero ahora están disponibles en el servicio de utilidaes (__utilidadesService__).

# [7.1.2] 29-05-2019

## Added

- Se agregan las __directivas de seguridad por permisos de usuario__ para el acceso las distintas funcionalidades del proyecto base.
- Se agregan 2 nuevas validaciones para el manejo de errores cuando se consulta al MISE. Se agregaron:
  - La cuenta usuario se encuentra __suspendida__
  - La cuenta usuario se encuentra __deshabilitada__

## Changed

- Se modifica la consulta que obtiene la lista de unidades programáticas y se agrego un ordenamiento númerico de estas por su id.

## Fixed

- Se recupera el servicio restful de usuarios llamado __arcaAcceso__ que permite __*crear*__ la estructura de permisos y datos del usuario con el que las aplicaciones de 3ros pueden hacer uso de *TODOS* los servicios restful y vistas de la plataforma Arca - MEAN.

# [7.1.1] 24-05-2019

## Added

- Para la generación de tokens de seguridad en el proyecto base se agregó una validación que permite indicarle al usuario si el formato de los datos contenidos en el _payload_ no contiene el id interno de la unidad programática ni tampoco el identificador de la unidad programática (idUP).
Además de que ahora el proceso de generación de tokens de forma automática obtiene el id para la unidad programática que solicita el token por medio del idUP.

## Changed

- Se modifica el mantenimiento de usuarios para agregar el parámetro de tipos de identificación en el formulario de edición.

## Fixed

- Se corrige parte del proceso de inicio de sesión de usuarios debido a referencias erróneas al catálogo de _tiposIdentificacion_ y al servicio de utilidades del lado de los servicios rest.
- Se corrige el código fuente donde aún se hacian llamados a los catálogos de sistema bajo el estándar anterior. Ahora se consumen bajo el nuevo concepto de colecciones separadas en la base de datos.
- Se corrige el servicio de utilidades del lado cliente en el método JSONize para indicar que el tipo de dato devuelto es any y asi acceder a cualquier propiedad.

# [7.1.0] 22-05-2019

## Added

- Se agrega el mantenimiento de **permisos de usuario**; lo que permite gestionar los permisos de cada usuario por aplicativo y unidad programática; dichos permisos son *estrictamente locales*.

## Changed

- Se sustituyen los módulos NPM que hacian referencia a recursos estáticos en el proyecto (fotos, estilos, fuentes, iconos, etc.) por las referencias que apuntan al nuevo __servidor de recursos Web estáticos__ (<https://arcawebkit.ccss.sa.cr:8443>).
- Se actualizan los módulos npm en general a sus últimas versiones disponibles.

## Fixed

- Se corrige el fichero de configuración de los servicios rest para activar el protocolo _HTTPS_ para el sistema base en un ambiente de __producción__.
- Se actualiza el servicio de utilidades de los servicios rest cambiando la referencia del controlador de parámetros debido a un llamado __ciclico__ de una función que en su lógica llamaba a otra función del controlador de parámetros; y esto producia un error.

# [7.0.0] 15-05-2019

## Added

- Se incluye el componente llamado **documento-printer** para el envio de datos a una impresora mediante _JSON_.
- Se crea el CRUD correspondiente al catálogo de **permisos por aplicación**, lo que permite gestionar permisos a nivel local solamente (no toca permisos heredados de MISE).
- Se agrega una nueva directiva de seguridad llamada **arcaAccesoPermiso**, la cuál utiliza los permisos asignados al usuario para indicar si tiene acceso o no a cualquier elemento de la aplicación (opción de menú, módulos, acciones sobre formularios, etc.).
- Se agrega las funciones para manejo de tokens JWT por medio de un *middleware* llamado **jsonWebTokenService**.
- Se agrega un nuevo servicio para manejo de funciones utilitarias del lado de los servicios _rest_ por medio de un *middleware* llamado **utilidadesService**.

## Changed

- Se modifican **TODOS** los catálogos del core base, por lo que ahora están disponibles como colecciones separadas y no embebidas en una única colección.
- Se modifica la forma en que inicia el servidor de servicios _rest_ cuando se activa el protocolo HTTPS y los certificados de seguridad.

## Deprecated

- Se descontinúan todas las referencias del manejo de asignación de permisos para los usuarios mediante el uso de perfiles; esto por cuanto ahora se gestiona por permisos de acceso a las funcionalidades o módulos de la aplicación.
- Las funciones definidas en la clase de **utilidades** de los servicios rest se decontinuará en los próximos releases del proyecto.

## Fixed

- Se corrigen las referencias (URL's) de TODOS los ambientes del proyecto base; esto por cuanto han cambiado los números de puertos pre-definidos.

# [6.6.0] 25-04-2019

## Added

- Se agrega la librería **helmet** para proteger la aplicación de vulnerabilidades conocidas mediante el establecimiento correcto de las cabeceras Http/Https.

## Changed

- Se modifica el proyecto para incluir el uso de certificados de seguridad **(SSL)** de la _CCSS_; por lo que se modifica también el fichero de configuración estableciendo las rutas absolutas de dichos certificados.
- Se modifica el fichero de configuración de los servicios rest para cambiar las referencias cuando conecta por **HTTPS**.

## Fixed

- Se corrigen las referencias a los sitios de pruebas y producción de la plataforma Pentaho (pasando de _Http_ a _Https_).

# [6.5.0] 02-04-2019

## Changed

- Se trabaja en el mantenimiento de **parametros** de la plataforma Arca - MEAN. Se establece el manejo de parámetros globales, por aplicación y por unidad programática.

# [6.4.0] 14-03-2019

## Added

- Se agrega el módulo llamado __bson-objectid__ que permite porder crear objetos tipo BSON para el manejo de los ID's a nivel de la base de datos Mongo; todo esto desde el lado del cliente o desde los servicios rest (sin ir a la base de datos).
- Se crea servicio rest que permite obtener de la base de datos de _personas_ la lista de fallecidos en un rango de fechas determinado; dicho rango de fechas es referente a la fecha de **inclusión/actualización** dentro del padrón.
- Se agrega el servicio rest que maneja el CRUD correspondiente al catálogo de _bodegas y ubicaciones_ dentro del módulo de **_inventarios_**.
- Se agrega el servicio rest que maneja el CRUD correspondiente al catálogo de _estados de la toma física_ dentro del módulo de **_inventarios_**.
- Se agrega el servicio rest que maneja el CRUD correspondiente al catálogo de _tipos de embalajes_ dentro del módulo de **_inventarios_**.
- Se agrega el servicio rest que maneja el CRUD correspondiente al catálogo de _tipos de movimiento_ dentro del módulo de **_inventarios_**.
- Se agrega el servicio rest que maneja el CRUD correspondiente al catálogo de _productos_ dentro del módulo de **_inventarios_**.

## Changed

- Se modifica el módelo de datos para las **Personas** agregando nuevas propiedades relacionadas a fallecimiento y nacimiento.
- Se modifica el manejo de los catálogos en la base de datos Mongo extrayendo los items de cada catálogo a colecciones independientes; por lo tanto se modican los servicios angular y sus respectivos servcios rest.

## Fixed

- Se corrige problema que mostraba múltiples ventanas de error cuando existian múltiples _request_ al servidor con código de estado **Forbidden 403** como respuesta.

# [6.3.0] 28-01-2019

## Added

- Se agrega la nueva funcionalidad de __impresión__ dentro de la plataforma Arca - MEAN.
- Se incluye un nuevo __pipe__ llamado _FiltrarParametrosObjetoPipe_ que permite mostrar/ocultar un conjunto de elementos en el DOM del documento HTML.

## Changed

- Se actualizan los módulos npm en general a sus últimas versiones disponibles.

## Fixed

- Se corrigen problemas en las capturas de error de los componentes de _Job's_ y _Etl's_ ya que no estaban siendo controlados los mensajes de error.
- Se corrige problema cuando existen múltiples solicitudes __activas__ al servidor de servicios rest y este retorna un mensaje de error 403; de esta forma el sistema solo mostrará un único mensaje de error de vencimiento de credenciales.
- Se corrige el error que existia cuando __MISE__ bloqueaba un usuario y este premanecia habilitado en la base de datos local; lo que provocaba que en caso de que el aplicativo _"arrancará" sin validación MISE o que si MISE estuviera inaccesible_, que un usuario bloquedo pudiera loguearse con la última clave válida.
- Se corrige el error en la plataforma __Arca - MEAN__ cuando un usuario con sus credenciales intentaba ingresar a las distintas aplicaciones donde poseia permisos a nivel MISE y el sistema no lo permitia (aún cuando poseía permisos sobre estas aplicaciones).
- Se repara el problema existente a la hora de establecer el objeto __LOG__ donde la fecha de creación _default_ no estaba correspondiendo la actual.

# [6.2.0] 07-11-2018

## Changed

- Se realiza la actualización de los paquetes **angular** del proyecto base (arca.bcore) pasando de la versión *v6.1.10* a la versión *v7.0.2*.
- Se actualiza la versión del paquete **angular-cli** pasando de la versión *v6.2.6* a la versión *v7.0.4*.
- Se actualiza la versión del paquete **angular-material** pasando de la versión *v6.4.7* a la versión *v7.0.3*.
- Se actualiza la versión de **Typescript** pasando de la versión *v2.9.2* a la versión *v3.1.6*.
- Se actualizan los módulos npm en general a sus últimas versiones disponibles.

# [6.1.2] 31-10-2018

## Added

- Se agrega nueva validación para las *rutas hijas* en los ficheros de módulos de ruteo llamada **canActivateChild**, lo que permite validar **TODAS** la rutas hijas definidas en la configuración de dichos fichero de cada módulo.

## Changed

- Se actualizan los ficheros de rutas de los módulos del proyecto base para incluir las rutas que no estaban siendo analizadas por los servicios de autorización; además se incluyo el nuevo validador de rutas hijas llamado **canActivateChild**.

- Se actualizan los diseños de las vistas correspondientes a los catálogos generales y mantenimiento de usuarios del proyecto base.

## Fixed

- Se corrige problema con el manejo del tiempo de _sesión_ del usuario por medio del token de seguridad y su renovación; esto por cuanto el proceso no se estaba ejecutando correctamente y no se estaban renovando los token por lo que la sesión siempre se vencia.

- Se corrige error en la captura de los _response_ donde al existir múltiples mensajes de fallo con el token del usuario (401 = Unauthorized, 403 = Forbidden y 408 = Request Timeout); el sistema mostraba varias veces la ventana de error al usuario. Ahora solo se muestra una única vez.

# [6.1.1] 26-10-2018

## Changed

- Se incluyen cambios en el proyecto principal provenientes de otros proyectos de la plataforma Arca - MEAN. Entre los cambios más significativos están:

  - Ajuste del _sidenav_ principal para mantener de primero el link de acceso directo a los módulos de cada proyecto; esto en la etiqueta __toolbar__.
  - Mejora al diseño del componente de búsqueda de asegurados.
  - Ajuste al diseño de la vista "Acerca de".

## Fixed

- Se modifica la carpeta __temporal__ que utilizan los componentes de **Jobs, Etl's y el proceso de carga de SIGES**; que es donde cargan los ficheros que son enviandos al servidor de **Pentaho** para su procesamiento.

# [6.1.0] 19-10-2018

## Added

- Se agrega al fichero de utilidades la función llamada **TamanoAproximadoObjeto** que se encarga de obtener el "peso" en bytes de un objeto complejo en memoria. Con esto se puede realizar la comparación de objetos complejos en memoria y determinar si son iguales (sin importar si las propiedades de estos objetos están en disitinto orden por ejemplo).

## Changed

- Se modifican los accesos directos al módulo "Administrador" agregando una validación para que solo los usuarios con perfil administrador puedan ingresar.
- Se modifica el mantenimiento de __usuarios__ agregando el componente de búsqueda de personas desde el padrón nacvional cuando se va a crear un nuevo usuario.

## Fixed

- Se corrigen problemas con el llamado _callback_ en las funciones __async.eachseries__ del mongoose; lo que estaba provoncado que en casos particulares se terminaba de ejecutar el ciclo sin haber terminado las llamadas _callback_.

# [6.0.0] 16-10-2018

## Added

- Se crea el mantenimiento llamado _unidades-programaticas-inicio-sesion_ que permite agregar/habilitar/deshabilitar las up's que pueden iniciar sesión sus usuarios; esto, por aplicación Arca - MEAN.

## Changed

- Se modifica el __inicio de sesión__ para que en la selección de unidades programáticas se cargue solo las UP's a las cuáles la aplicación Arca - MEAN tiene habilitado.
- Se actualiza el fichero package.json con las últimas versiones disponibles de los módulos requeridos en el proyecto.

## Fixed

- Se corrige problemas con el controlador que maneja el __inicio de sesión_ ya que TODAS las llamadas a funciones _callback_ continuaban su ejecución a pesar de darse un error o si el flujo debia interrumpirse de alguna forma. Se agregó un retorno (_return_) de cada sentencia _callback_ para corregir el problema.

# [5.6.1] 11-10-2018

## Added

- Se agrega al login de usuarios una validación que permite mediante un parámetro determinar si el ingreso al sistema se hará por medio del MISE o unicamente por la base de datos local de la plataforma Arca - MEAN.

## Changed

- Se modifican las credenciales de acceso al servidor de Pentaho para los componentes de reportes y tableros.
- Se modifica el nombre que identifica el sistema base para el MISE (__SACO__ - **S**istema **A**rca **CO**re); esto en el fichero de configuración de los servicios rest. Además se actualiza la URL que corresponde a los servcios Web del Arca apuntando al servidor ubicado en __CODISA__; esto en el ambiente de producción.

## Fixed

- Se corrige problema con el mantenimiento de parámetros cuando se guardaba la información no se desactivaba el botón _Listo_.
- Se corrige problema en el mantenimiento de usuarios ya que la propiedad de genero no correspondia a la propiedad en la base de datos y por ende no cargaba los datos en el formulario.
- Se corrige la funcionalidad de agregar nuevos usuarios para que valide si ya existen los datos en la colección de personas para que solo actualice lo que corresponde a la colección de usuario y mantenga los datos de TSE.

# [5.6.0] 10-10-2018

## Added

- Se agrega la funcionalidad que permite agregar y modificar los parámetros de la aplicación base (arca.core).

## Changed

- Se actualiza el funcionamiento y despliegue de la vista _Acerca de_.
- Se actualizan los diseños de los catálogos generales de la plataforma Arca - MEAN.
- Se actualizan las vistas de los componentes para ejecutar transformaciones (ETL's) y tareas (JOB's) en el servidor de Pentaho.

# [5.5.0] 03-10-2018

## Added

- Se crea el componente para ejecutar transformaciones (__ETL's__) a nivel del servidor de _Pentaho_ desde la plataforma Arca - MEAN.

## Changed

- Se actualizan las configuraciones de los distintos ambientes disponibles para la aplicación cliente (_Developer, Test, Production, Demos_).
- Se modifican las referencias de las direcciones (URL's) en los servicios api de la plataforma Arca - MEAN.
- Se actualiza el fichero package.json con las últimas versiones disponibles de los módulos requeridos en el proyecto.

## Fixed

- Se corrige problema con el componente de asegurados en el método que realiza la búsqueda ya que se espera como parámetro de entrada el evento que desencadena dicha búsqueda y el mismo no estaba presente.
- Se corrige error en el módulo de controles Arca ya que se habia perdido la referencia a un nuevo componente para el manejo de impresoras a través de la plataforma.

# [5.4.3] 28-09-2018

## Fixed

- Se corrigen errores graves derivados del proceso de combinar el código fuente para los componentes de búsqueda de personas y asegurados desde el SIAC.

# [5.4.1] 27-09-2018

## Fixed

- Se ajusta el diseño y la funcionalidad de la búsqueda de asegurados desde el SIAC.

# [5.3.1] 27-09-2018

## Changed

- Se modifica el componente de búsqueda de usuarios para búsquedas más optimas por identificación y por nombre completo (nombre y apellidos).
- Se modifica el componente que realiza el proceso SIGES para que permita recibir el ID de servicio por default y bloquear que se pueda seleccionar cualquier otro servicio.

## Fixed

- Se corrige problema con la conexión a la base de datos mongo cuando se crean __indices__ desde la aplicación.
- Se corrige problema con el componente para el proceso del SIGES ya que no estaba recibiendo los datos que eran enviados a este.

# [5.3.0] 25-09-2018

## Added

- Se crea el componente encargado de ejecutar JOBS en el servidor de Pentaho(JobsTaskComponent).
- Se crea el componente y servicio para realizar el proceso de carga de artículos del catálogo institucional de suministros (ProcesoSIGESComponent) a partir del fichero XML que mensualmente reciben los servicios.
- Se crea el componente y servicio para el nuevo catálogo de JOBS; los cuales son una lista de Jobs disponibles en el servidor de Pentaho.
- Se crea componente AseguradosSearchComponent que permite realizar búsquedas de asegurados por medio del servicio de SIAC del EDUS.
- Se crea componente DialogPersonasListarComponent que permite realizar búsquedas de personas por medio de la base de datos del padrón nacional procedente del Tribunal Supremo de Elecciones (TSE).
- Se agrega módulo "parseXMLJSON" que permite convertir un stream XML a un formato JSON (campo:valor). Se crea una función en las utilidades de la plataforma para acceder a dicha funcionalidad.

## Changed

- Se actualiza el fichero package.json con las últimas versiones disponibles de los módulos requeridos en el proyecto.

## Fixed

- Se agrega a los archivos de configuración de cada ambiente del proyecto (en la aplicación cliente, así como en los servicios rest) la referencia al servidor de Pentaho; tanto para consumir URL's como para conectarse por medio de SSH.
- Se corrige las búsquedas de usuarios de la plataforma Arca - MEAN ya que la primera vez no retornaba resultados.

# [5.2.0] 11-09-2018

## Added

- Se agrega un nuevo servicio rest que permite generar el objeto JSON que contiene la información básica que requiere cualquier aplicación de la plataforma Arca - MEAN para ser empotrada (embebida) en otra aplicación o desde un simple HTML (_para más detalles visite el Wiki [Empotrar Arca - MEAN dentro de otra aplicación](http://arcagitlab.ccss.sa.cr/arca-base/arca.bcore/wikis/empotrar)_).

## Changed

- Se modifica el servicio de generación de tokens (JWT) cambiando los datos del formulario y la URL de dicho servicio. Además de agregar validaciones que permitan controlar la aplicación rest cuando en la consulta no se envian datos en el body o no esta bien formada la petición. Se valida el tiempo de vida de los tokens (ttl) para ajustar el dato de renovación de tiempo y permitir establecerlo por default a una hora una vez que ha vencido dicha llave.
- Se actualizan las librerias del package.json a sus últimas actualizaciones disponibles.

# [5.1.0] 09-08-2018

## Changed

- Se modifican los servicios Angular para TODOS los catálogos creando para cada uno un archivo de servicio independiente y eliminando el fichero general de servicios para dichos catálogos.

# [4.3.1] 24-07-2018

## Added

- En el login de usuarios se agrega la validación que permite redireccionar a la página de **Cambio de Contraseña** cuando MISE indica que la contraseña del usuario ha _caducado_.

## Fixed

- Se realizan correcciones en la documentación del proyecto base de la plataforma Arca - MEAN (arca.bcore), todo del lado cliente; adaptando la misma al estándar indicado por la herramienta **[_Compodoc_](https://compodoc.app/guides/getting-started.html).**
- En el login de usuarios se corrigen las validaciones de los mensajes de error que provienen del MISE ya que no estaban siendo capturadas de forma correcta del lado cliente, por lo que en los casos que debia actualizar la contraseña no redireccionaba al mantenimiento correspondiente.

# [4.3.0] 17-07-2018

## Added

- Se agrega mantenimiento de tipos de sangre (Grupo RH) a la lista de catálogos generales.
- Se agrega mantenimiento de tipos de iconos a la lista de catálogos generales.
- Se agregan nuevos pipes (safeHtml, safeStyle y safeURL) para poder establecer en el html código que no sea malicioso (sanitization).

## Fixed

- Se corrigen problemas a nivel de estructura de varios ficheros del proyecto. Se eliminan variables, métodos y llamados que no se estaban utilizando. Además se corrige el ruteo de ficheros en los archivos typescript del proyecto.

# [4.2.0] 06-07-2018

## Added

- Se agrega componente que permite realizar búsquedas de artículos desde la base de datos del SIGES (Catálogo General de Suministros institucional).
- Se incluye una directiva llamada **AutoRealceDirective** que permite realzar un componente marcandolo de un color diferente; lo que le indica al usario que existe un problema con ese componente en su validación interna.

## Changed

- Se modifica el componente que permite el manajo de archivos en por medio de GridFS de Mongo para *"customizar"* los mensajes que muestra al usuario.

## Fixed

- Se corrige problema que presenta el módulo *mongoose* cuando establece la conexión a bases de datos Mongo en sus versiones más recientes(>=4.0).

# [4.0.0] 12-06-2018

## Changed

- Se realiza la actualización de la versión de **Angular** pasando de la *5.2.9* a la *6.0.4*; además de actualizarse todas las dependencias del proyecto por las versiones más recientes disponibles. Para más detalles de la actualización en cada proyecto se sugiere seguir la guia dada por los desarrollades de [Angular](https://angular-update-guide.firebaseapp.com/).

# [3.4.0] 07-06-2018

## Added

- Se agrega la referencia del servidor de reportes de **Pentaho** en los ficheros de configuración para cada uno de los ambientes disponibles (desarrollo, pruebas, demos, producción).
- Se crea un nuevo componente para acceder a los tableros (dashboards) provenientes del servidor de **Pentaho** y poder embeberlos dentro de cualquier vista en la plataforma Arca - MEAN.
- Se crea un nuevo componente para acceder a los reportes provenientes del servidor de **Pentaho** y hacerlos accesibles desde cualquier vista en la plataforma Arca - MEAN.
- Se agrega la limpieza de *cookies* para el consumo de datos desde el servidor de **Pentaho**.
- Se agrega un componente llamado **TEST** que se puede utilizar para realizar pruebas; como por ejemplo uso de otros componentes, llamado de servicios, etc.
- Se agrega mejora en el componente de manejo de archivos para realizar un mejor control de los mismos que se agregan al servidor para que estos no queden "huerfanos" en caso de no completar alguna transacción que conlleve el guardar archivos.

## Changed

- Se realiza una actualización del estilo principal de todo el proyecto Arca - MEAN.

## Fixed

- Se corrige problema con la validación de solicitudes *REQUEST* cuando estas son a servicios fuera de la plataforma Arca; ya que no deben incluir los token de seguridad en la petición.
- Se corrige el llamado de servicios rest a los catálogos generales ya que las rutas no estaban mapeadas aún (Tipos de parentesco, Países, Provincias, Cantones, Distritos, Servicios, Tipos de funcionario).

# [3.3.1] 25-05-2018

## Fixed

- Se corrige problema con las directivas de seguridad que se utilizan en los tags HTML para permitir o restringir accesos a los usuarios; ya que no se podía utilizar en un módulo que no fuese distinto al administrador.
- Se corrige problema en la validación de perfiles de usuario por nombre dado que no estaba realizando la búsqueda del perfil por aplicativo de forma correcta y retornaba verdadero mientras existiera para cualquier sistema.

# [3.3.0] 24-05-2018

## Changed

- Se modifican los ficheros de configuración de los proyectos cliente y de servicios rest para agregar las referencias (url's) correspondientes al nuevo proyecto de la plataforma Arca - MEAN llamado **Arca - Recursos Humanos (arca.rhcore)**.
- Se modifican los ficheros de configuración de los proyectos cliente y de servicios rest para establecer por *default* que las aplicaciones inicien en modo **NO SEGURO (http)** y no por https.
- Se modifican los ficheros de configuración de la solución cliente y del lado de servicios rest para que en el ambiente de **producción** las url's sean por nombre y no por ip (arcamixin.ccss.sa.cr).

## Fixed

- Se modifican algunas referencias a funciones y variables pasándolas de privadas a PUBLICAS, ya que a la hora de compilar el proyecto Angular con el parámetro *AOT (Ahead-of-Time)* presenta errores en el alcance de estas.
- Se modifica el proceso de **login de usuarios** ya que existia un error en el flujo que no permitia actualizar los perfiles del usuario de forma local cuando estos habían cambiado a nivel del MISE (no refrescaba localmente los perfiles si tenia más o menos en el MISE).

# [3.2.0] 22-05-2018

## Added

- Se agregan funcionalidades que permiten el uso de *sockets* en las aplicaciones de la plataforma Arca - MEAN.
- Se agrega un componente llamado **arca-archivos** que permite el manejo (almacenamiento, consulta y visualización) de archivos (de cualquier tipo) mediante el uso de la funcionalidad **GridFS** provista por el motor de base de datos Mongo.
- Se agregan nuevos componentes para el manejo de fechas y tiempo (*date-time-picker* y *dialogo-filtro-rango-fechas*).
- Se agregan nuevos catálogos de sistema al servicio de *catalogos* generales:
  - Tipos de parentesco
  - Países
  - Provincias
  - Cantones
  - Distritos
  - Servicios
  - Tipos de funcionario

# [3.1.0] 05-05-2018

## Added

- Se crea un nuevo componente llamado *diagnosticos-search* que permite realizar búsquedas de diagnósticos basados en el **CIE10** y se puede utilizar en cualquier aplicativo de la plataforma Arca - MEAN.

## Changed

- Se parametriza la configuración de acceso al servicio MISE por aplicativo; asi como el timeout por medio del fichero de configuración del lado del servidor de servicios rest.
- Se modifica el acceso a la aplicación para que el usuario seleccione la unidad programática donde quiere iniciar y posteriormente mediante MISE se **reutilizan** los permisos definidos en este, dentro de la plataforma Arca - MEAN. Lo que también permite seguir trabajando con dichos permisos por usuario aún cuando no haya una conexión con MISE (cuando el servicio no esta disponible).

## Removed

- Se elimina el paso de crear manualmente los usuarios en la plataforma Arca - MEAN; ahora con solo las credenciales MISE puede hacer uso de la aplicación que corresponda dentro de la plataforma.

## Fixed

- Se corrige el servicio de hospitalización para que utilice *HttpClient* en vez de *http* dado el cambio de versión del framework Angular.

# [3.0.0] 05-04-2018

## Changed

- Se realiza la actualización de la versión de **Angular** pasando de la *4.2.5* a la *5.2.9*; además de actualizarse todas las dependencias del proyecto por las versiones más recientes disponibles. Para más detalles de la actualización en cada proyecto se sugiere seguir la guia dada por los desarrollades de [Angular](https://angular-update-guide.firebaseapp.com/).

# [2.4.0] 04-04-2018

## Added

- Se agrega una nueva función (como una promesa) llamada **Sleep** en las utilidades que simula un timeout en la ejecución del código javascript.
- Se agrega la propiedad **_id** (de tipo mongoose.Schema.Types.ObjectId) a las interfaces de paths y perfiles para el manejo de los UPDATES y que conserven su id original.
- Se agregan las directivas de seguridad al módulo principal core para que la hereden los sub-modulos.
- Se agrega a las vistas del home principal y al menú lateral principal las directivas para que solo administradores puedan acceder a las funcionalidad del módulo **Administrador**
- Se agrega validación en los servicios de autorización que mediante un token válido en la URL de cualquier vista de la aplicación le permite acceder a dicha ruta.
- Se agrega al servicio de utilidades del cliente la funcionalidad que permite convertir una cadena de texto (en formato JSON) a un objeto JSON *(propiedad {llave: valor})*.
- Se crea el componente y servicio para la generación de tokens a demanda (JWT) y se le agrega la posibilidad de incluir datos en formato JSON dentro del token generado.

## Changed

- Se modificó todo el CRUD de los permisos y ahora se hace sobre una colecciónn llamada PERMISOS en la base de datos del core y ya no como una propiedad dentro del usuario; lo que implica un cmabio en el modelo y controlador de usuarios para eliminar la propiedad "unidadesProgramaticas". Además se ajustan las propiedades logs.
- Se modifica el logueo de usuarios para que consulte por unidad programática y que además tome los datos de las unidades programáticas de la nueva colección de permisos en la base de datos core. Se modificó la estructura de la información del usuario que se almacena en el local storage.
- Se modifican el controlador y las rutas de los catálogos para agregar funciones que obtengan los ObjectId de los paths y perfiles indicando el nombre de estos como parametro.
- Se modifican los ficheros de configuración del lado cliente (environments) para agregar parámetros que permiten iniciar la aplicación cliente y/o consumir los servicios rest por medio del protocolo **HTTPS o por HTTP**.
- Se modifican los ficheros de configuración y expressJS del lado servidor (config.js y express.js) agregando un parámetro que permite iniciar la aplicación de servicios rest por medio del protocolo **HTTPS o por HTTP**.

## Removed

- Se modifica el fichero principal de configuración de los servicios rest para **eliminar** la ruta de la base de datos de seguridad; ya que no se utilizará más por que ahora existe una colección dentro de la base de datos del core para el manejo de permisos.

## Fixed

- Se corrigen problemas en el control reactivo de los mantenimientos de paths y perfiles con la propiedad **_id**, ya que no se estaba seteando de forma correcta el valor NULO al iniciar el formulario.
- Se corrige el problema con las directivas de seguridad (por paths, perfiles y aplicación) que no validaban de forma correcta cuando en el arreglo de permisos existia un TRUE en la respuesta para el perfil solicitado y existian otros falsos; por lo que no renderizaba el control en pantalla a pesar de tener al menos un perfil verdadero.

# [2.3.0] 16-03-2018

## Added

- Se agregan los servicios que obtiene las listas de *paths* y *perfiles* por aplicación en los catálogos generales.
- Se agrega una interface llamada *IArcaLog* que permite manejar las propiedades básicas para en control de logs en los registros de la base de datos.

## Changed

- Se modifica la funcionalidad de asignar permisos a usuarios para cualquier aplicación y en cualquier unidad programática.
- Se modifican los nombres de las funciones del servicio de **catálogos para** ajustarlos al estándar de nombres.
- Se modifican los nombres de las funciones del servicio de **autorización** para ajustarlos al estándar de nombres.
- Se modifican las validaciones para la seguridad de la aplicación y validar por los identificadores (ObjectId) tanto de aplicación, paths y perfiles de usuario.

# [2.2.0] 28-02-2018

## Added

- Se agrega la funcionalidad que permite generar tokens para consumir servicios rest; esto en el módulo admin.

## Fixed

- Se modifica la generación de tokens cuando el usuario inicia sesión ya que la validación del tiempo de expiración no tomaba la fecha como UTC por lo que el tiempo transcurrido era en negativo por más de 6 horas y esto hacia que la sesión siguiera abierta pero se perdian los datos del usuario actual en le token.

# [2.1.0] 27-02-2018

## Added

- Se agregó un nuevo ambiente al proyecto llamado **demo**; esto para desplegar la aplicación en ambientes de demostración y/o capacitación; se hizo tanto en la aplicación cliente como en los servicios rest.
- Se agrega a los ambientes de desarrollo, pruebas y producción las referencias de los servicios rest para los módulos **Quirúrgico y Patología**.
- Se incluye un servicio rest que retorna la información de una unidad programática en especifico.
- Se agrega el manejo de logs para la creación y actualización de datos en la base de datos.
- Se modifican los datos del token del usuario; esto para agregar datos de la unidad programática y datos propios del usuario como id y nombre.
- Se modifica la configuración del ExpressJS para permitir enviar a todos los controladores los datos del usuario para realizar el proceso de logs en la base de datos.
- Se agrega las funciones *localDateToUTC* y *UTCToLocalDate* para el manejo del dato de fecha UTC en la base de datos Mongo.

## Fixed

- Se modifica la validación de los tokens de seguridad cuando se consulta alguna ruta dentro de los servicios, rest ya que el código de estado de error no era el correcto y provocaba que el usuario siguiera dentro de la aplicación a pesar de no tener un token de seguridad.
- Se corrige problema cuando se intentan agregar "n" cantidad de usuarios (de forma continua) en el mantenimiento de usuarios.
- Se corrige problema con el modulo ExpressJS utilizado para "mapear" las propiedades de logs (arcaLogs) ya que presentaba error que no permitia continuar la aplicación.

# [2.0.0] 20-02-2018

## Added

- Se agrega una interfaz llamada ***ICRUD*** que permite implementar las firmas básicas del CRUD para los servicios Angular y rest.
- Se crea un servicio rest de catálogos para el proyecto base.
- Se agrega validación que permite establecer un tiempo (timeout) para las consultas al servicio Web del MISE y evitar latencias prolongadas en caso de que no responda.
- Se agrega funcionalidad de limpieza (CLEAR) para el componente **autocompletar**.
- Se agrega un servicio Angular llamado **DataboxService** que permite el intercambio de datos simples o complejos entre rutas(paths) en la aplicación.
- Se agrega al fichero de configuración (tanto del lado cliente como del lado de los servicios rest) un nuevo ambientes para pruebas llamado **test**.
- Se agrega al fichero **package.json** la configuración que permite ejecutar el proyecto en el ambiente *DEVELOPMENT* en entornos de Microsoft Windows.

## Changed

- Se modifican los modelos (mongoose) de las colecciones Mongo para sustituir los Id's (númericos y cadenas de texto) por la propiedad **ObjectId** dada por la base de datos Mongo.
- Se modifican los servicios Angular para agregarles la implementación de la interfaz *ICRUD* que permite acceder a las firmas del CRUD.
- Se modifican las rutas de los servicios rest y sus respectivos controladores para estandarizar los nombres a los definidos por el generador del mongoose (List, Show, Create, Update, Remove).
- Se modifican los nombres de los componentes, servicios y modelos (mongoose) a un estandar de nombres en plural, para establecerlos igual que los nombres de las colecciones dados por la base de datos Mongo.

## Fixed

- Se agregan a los ficheros TS de los componentes la defición del encapsulado de estilos de NONE a EMULATED; de esta forma si respeta los estilos establecidos en cada vista.
- Se corrigen las referencias a variables llamadas en el HTML de los componentes Angular, y se eliminan las que no están declaradas en el fichero TS; esto no permitia realizar el proceso de compilado (build) de la aplicación para cualquier ambiente (test, production, etc.).

## Removed

- Se elimina el fichero /bin/app.js y se traslada el código que inicia el servidor de servicios rest al fichero server.js, puesto que no permitia inicializar la aplicación en el puerto establecido en el fichero de configuración.
- Se elimina el servicio Angular llamado **core.service.ts**; el cúal contenia los llamados a los servicios rest de catálogos.
- Se eliminan las funciones CRUD que NO se utilizan en los controladores de los servicios rest.

# [1.0.0] 20-10-2017

## Added

- Liberación del código fuente base del proyecto Arca - MEAN en una versión preliminar.
