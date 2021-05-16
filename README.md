# Plataforma Bitzú

[![pipeline status](http://arcagitlab.ccss.sa.cr/grupo.pi/pi.bitzu/badges/master/pipeline.svg)](http://arcagitlab.ccss.sa.cr/grupo.pi/pi.bitzu/commits/master)

Bitzú es una plataforma que brinda soluciones a distintas áreas y/o servicios dentro del entorno del proyecto Plan de Innovación, el cual tiene como objetivo la implantación del ERP SAP en la Caja Costarricense del Seguro Social (CCSS).

El proyecto **Bitzú** esta concebido bajo un conjunto de soluciones Open-Source conocidas como **"Full-Stack MEAN"**; donde convergen múltiples tecnologias basadas 100% en el lenguaje **javascript** (MongoDB, ExpressJS, Angular, NodeJS) y en su construcción se incluyeron las mejores prácticas del ciclo de vida para el desarrollo de software.

El código fuente del proyecto se divide en 2 partes; la primera es donde se ubican los fuentes correspondientes a la interfaz de usuario y por otro lado tenemos el código fuente donde reside el servidor de servicios REST para las aplicaciones.

Del lado cliente utilizamos el lenguaje de programación [Angular](https://angular.io/), el cúal utiliza [Typescript](https://www.typescriptlang.org/). En el servidor para la construcción de los servicios rest se utiliza [NodeJS](https://nodejs.org/es/) y el framework [ExpressJS](http://expressjs.com/es/). Estos 2 componentes pueden interactuar con bases de datos relaciones como SQL Server, MySQL, María, Oracle, etc. y también con bases de datos de tipo no relacional; en especifico con [MongoDB (MongoDB Community Edition)](https://docs.mongodb.com/manual/administration/install-community/#install-mongodb-community-edition).

Dicha distribución de código se indica a continuación:

-   Código aplicación cliente (**Angular**): `.src/app`
-   Código servicios restful (**Nodej.js y Express.js**): `.src/server`

## Instalación

El proyecto Bitzú esta construido con tecnología multiplataforma, lo que permite poder descargar, codificar y ejecutarlo en cualquier sistema operativo (Windows, Linux, MACOS).

Basicamente se require:

-   El entorno de ejecución para javascript [NodeJS](https://nodejs.org/es/) y el administrador de paquetes para javascript [NPM](https://www.npmjs.com/). Al instalar NodeJS automaticamente se instalará NPM. La versión requerida mínima de NodeJS es la **v12.16.2** y para NPM es la **v6.14.4**.
-   El cliente de linea de comandos para Angular llamado [Angular CLI](https://github.com/angular/angular-cli).
-   Instalar la base de datos [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/#install-mongodb-community-edition) para realizar el desarrollo y/o pruebas en su versión **v4.2**.

Una vez instalado lo anterior deberá realizar los siguientes pasos para obtener y ejecutar el proyecto:

1. Obtener una copia del proyecto y ubicarlo en alguna carpeta de su estación de trabajo; esta copia del fuente le será suministrada por el desarrollador MASTER de cada proyecto en el cuál usted va a trabajar.
    - $`git clone git://ejemplo.com/prueba/test.git <rutaCarpetaProyecto>`
2. Con una terminal se debe desplazar dentro de la carpeta que contiene el código local del proyecto (la carpeta debe poseer permisos de escritura/lectura).
3. Deberá instalar las dependencias necesarias para el proyecto utilizando los siguientes comandos:
    - $`npm install`
4. Antes de inicializar la solución deberá:

    - Modificar en todo el código fuente el nombre del proyecto; nada más busca todas las referencias llamadas **bitzu** y las sustituye por el nombre de su proyecto (Ej.: nutricion, patologia, quirurgico, widgets, etc.). En caso de estar asignado el nombre por defecto, omitir este paso. 
    - Tener la base de datos MongoDB con los datos básicos para que funcione su proyecto; puede restarurar un _backup_ del ambiente **TEST** localmente y si corresponde, agregar la información para su proyecto en las colecciones:

        - arca-core.catalogo-aplicaciones-arca
        - arca-core.catalogo-unidades-programaticas-inicio-sesion
        - arca-core.permisos-usuarios (en caso de que el sistema sea **NO MISE**, mínimo debe existir un permiso asociado a la aplicación)

        **Importante**: En caso de que no exista su usuario en la base de datos hay que verificar y si es requerido ingresar/actualizar la información para su usuario en las siguientes colecciones (siguiendo el orden):

        1. arca-core.personas
        2. arca-core.usuarios

## Servidor de desarrollo

Hecha la instalación y configuraciones indicadas anteriormente puede proceder a iniciar los servidores Web(cliente y rest) mediante los comandos:

### Cliente

-   **http**: $`ng serve --open --host 127.0.0.1`

-   **https**: $`ng serve --open --host 127.0.0.1 --ssl true --ssl-key /etc/llave.key --ssl-cert /etc/certificado.crt`

### Rest api (http y https)

-   $`npm start`

    _Nota_: Si el protocolo HTTPS se usa en el puerto 443 se debe ejectutar la instrucción como sudo: $`sudo npm start`

## Scaffolding

El proyecto está provisto de generadores automáticos de código, los cuales crean las carpetas y ficheros necesarios para los componentes o módulos que se requieren programar incluyendo las pruebas unitarias del cliente.

Para el lado del cliente se realiza mediante los comandos provistos por el [Angular CLI](https://github.com/angular/angular-cli) (Ej.: `ng generate directive | pipe | service | class | module`); y del lado del servidor se utiliza el generador de código [moongose](https://www.npmjs.com/package/express-mongoose-generator) para crear el CRUD a las bases de datos Mongo.

## Deploy, pruebas unitarias (karma) y pruebas e2e (protactor)

Para cada una de estas etapas se utiliza igualmente los comandos provistos por el [Angular CLI](https://github.com/angular/angular-cli):

-   [build](https://github.com/angular/angular-cli/wiki#bundling)
-   [test](https://github.com/angular/angular-cli/wiki#running-unit-tests)
-   [e2e](https://github.com/angular/angular-cli/wiki#running-end-to-end-tests)

## Licencia

©Bitzú es una plataforma desarrollada por el equipo de TI del Plan de Innovación que pertenece a la [Caja Costarricense de Seguro Social (CCSS)](https://www.ccss.sa.cr/).

San José. Costa Rica. 2020 - 2021.
