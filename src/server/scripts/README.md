# Plataforma Arca - MEAN (CCSS)

## Prefacio

Como complemento al desarrollo de las soluciones Arca bajo el marco de trabajo MEAN se ha creado dentro de cada proyecto un conjunto de funciones que ayudarán a ejecutar distintos procesos que requieran computo extra y que Node.js como servidor Web que es no puede acoger de forma óptima.

## Funciones scripting  

Esta sección del proyecto Arca esta destinada alojar scripts de distintos lenguajes de programación (*bash, pyton, exe, java, etc.*) y que se puedan ejecutar independientemente a Node.js como procesos hijos (**child_process[^1]**) y de esta forma aprovechar la arquitectura subyancente del servidor/equipo donde se ejecute Node.js (**memoria, cpu's, etc.**).

La estructura dentro del proyecto Arca es la siguiente:

``` bash
- /src
	|- /server
		|- /scripts
			|- /<modulo|nombre_proyecto|identificador>
				|- scriptA.py
				|- scriptB.php
				|- scriptC.sh
				|- scriptD.exe
				|- scriptE.jar
				|- etc.
```

Es importante indicar que para trabajar con scripts se debe tener en cuenta:

- Que el compilador del lenguaje del script deberá estar **instalado y ser mantenido en el servidor** (esto para tener en consideración el tipo de lenguaje a utilizar).
- El script se deberá ejecutar/comportar como un proceso aislado a Node.js para que no afecte el rendimiento del servidor (**sandbox**).

### Referencias

[^1]: [Node.js - Child Process](https://nodejs.org/api/child_process.html#child_process_child_process)