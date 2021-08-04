import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Optional,
    Output,
    ViewChild
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UtilidadesService } from 'app/shared/services/utilidades.service';
import {
    IdataModelInfoGeneral,
    InfoGeneralComponent
} from 'app/shared/controls/info-general/info-general.component';
import {
    FormGroup,
    Validators,
    FormBuilder,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { DialogService } from 'app/shared/controls/dialog/dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { compact } from 'lodash';
import { MaterialesServiciosAltaEditar } from './materiales-servicios-alta-editar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'bitzu-materiales-servicios-alta-editar',
    templateUrl: './materiales-servicios-alta-editar.component.html',
    styleUrls: ['./materiales-servicios-alta-editar.component.scss'],

    animations: [
        // Evento que se ejecuta la transición 'fade in o fade out' para los componentes que tienen como identificador 'apps'
        trigger('apps', [
            // Transición de cualquier identificador a 'fadeIn'
            transition('* => fadeIn', [
                style({ opacity: 0 }),
                animate(1000, style({ opacity: 1 }))
            ]),
            // Transición de cualquier identificador a 'fadeOut'
            transition('* => fadeOut', [animate(1000, style({ opacity: 0 }))])
        ])
    ]
})
export class MaterialesServiciosAltaEditarComponent implements OnInit {
    /**
     * Variable que maneja la clase para el tema
     */
    public temaApp: string;

    /**
     * Variable que maneja los eventos de siguiente y anterior entre pantallas
     */
    public mostrarSigGeneral: boolean = true;
    public mostrarSigAlta: boolean = false;
    public mostrarAnt: boolean = false;
    public guardarInfo: boolean = false;

    /*Variable que habilita el formulario de alta de materiale o servicio */
    public esGeneral: Boolean = true;

    /*Variable que habilita el formulario de alta de materiale o servicio */
    public esAlta: Boolean = false;

    /*Variable que habilita los campos de ficha técnica */
    public esFicha: Boolean = false;

    /**
	Datos de formulario de alta para manipular la información y se traslada a otros componentes
	*/
    public frmAltaMaterial: FormGroup;

    /**
	Datos de formulario de ficha técnica para manipular la información y se traslada a otros componentes
	*/
    public frmFichaMaterial: FormGroup;

    /**
     *Variable para indicar si el formulario se debe resetar a un estado inicial
     */
    public esEstadoInicialForm = false;

    /**
     * Variable para recibir los datos de forma temporal y cargarlos al formgroup
     */
    private datos: IdataModelAltaMat;

    /**
     * Variable para mostrar/ocultar la barra de progreso
     */
    public esCargando = false;

    /**
     * Datos obtenidos del formulario info general
     */
    public dataInfoGeneral: IdataModelInfoGeneral;

    /**
     * Datos obtenidos del formulario de alta
     */
    public dataInfoFicha: IdataModelFichaMat;

    /**
     * Variable que contiene el valor por defecto del servicio
     */
    public valorDefaultServicioArea: string;

    /**
     * Variable que almacena los datos obtenidos de los catálogos
     */
	 public catalogo: any = [];


    /**
     * Propiedad decorativa para acceder al componente desde el HTML
     */
    @ViewChild('infoGeneralService')
    infoGeneralService: InfoGeneralComponent;

    /**
     * Variable para poder acceder al evento submit del formulario reactivo
     */
    @ViewChild('documentFormAlta')
    documentFormAlta: FormGroupDirective;

    /**
     * Variable para poder acceder al evento submit del formulario reactivo
     */
    @ViewChild('documentFormFicha')
    documentFormFicha: FormGroupDirective;

    /**
     * Atributo de salida que retorna el conjunto de datos dados por el usuario
     */
    @Output('validarItem')
    private validarItem: EventEmitter<IdataModelInfoGeneral> = new EventEmitter<IdataModelInfoGeneral>();

    /**
     * Variable temporal que maneja la lista de areas o servicios en el formulario
     */
    public tipoMoneda: any = [
        { _id: '1', descripcion: 'Colones', idServicio: 1 },
        { _id: '2', descripcion: 'Dólares', idServicio: 2 },
        { _id: '3', descripcion: 'Euros', idServicio: 3 }
    ];

    constructor(
        private utilidadesService: UtilidadesService,
        private fb: FormBuilder,
        private msgBox: DialogService,
        public dialogRef: MatDialogRef<MaterialesServiciosAltaEditarComponent>,
		private materialesServiciosAltaEditar: MaterialesServiciosAltaEditar,
		private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.frmAltaMaterial = this.fb.group({
            descMatServ: [null, Validators.required],
            estMatServ: [null, Validators.required],
            medMatServ: [null, Validators.required],
            despMatServ: [null, Validators.required],
            otrundMatServ: [null, Validators.required],
            tipMatServ: [null, Validators.required],
            promdMatServ: [null, Validators.required],
            valMatServ: [null, Validators.required],
            monedaMatServ: [null, Validators.required],
            JustAlta: [null, Validators.required]
        });

        this.frmFichaMaterial = this.fb.group({
            desctec: [null, Validators.required],
            literatura: [null, Validators.required],
            certcal: [null, Validators.required],
            emppri: [null, Validators.required],
            empsec: [null, Validators.required],
            empter: [null, Validators.required]
        });
    }

    /**
     * Metodo que se encarga de mostrar regresar los componentes a un paso anterior en el ingreso
     */
    public atras() {
        if (this.esAlta) {
            //Variables para saber cual pantalla mostrar
            this.esAlta = false;
            this.esGeneral = true;
            //Variables para saber cuales botones mostrar
            this.mostrarSigAlta = false;
            this.mostrarAnt = false;
            this.mostrarSigGeneral = true;
        } else if (this.esFicha) {
            //Variables para saber cual pantalla mostrar
            this.esFicha = false;
            this.esAlta = true;
            this.esGeneral = false;
            //Variables para saber cuales botones mostrar
            this.mostrarSigAlta = true;
            this.mostrarSigGeneral = false;
            this.mostrarAnt = true;
        }
    }

    /** Permite restablecer la vista del formulario a un estado inicial */
    public restablecerVistaFormulario(): void {
        if (this.esEstadoInicialForm) {
            this.frmAltaMaterial.reset(); // Limpia el formulario
            this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
        }
    }

    /**
     * Evento que dispara submit para el formulario hijo (child)
     */
    public validarInfoGeneral() {
        this.infoGeneralService.documentForm.onSubmit(undefined);
    }

    /**
     * Evento que dispara submit para el formulario hijo (child)
     */
    public validarInfoAlta() {
        this.esFicha = true;
        this.esAlta = false;
        this.mostrarSigAlta = false;
    }

    /**
     * Evento que viene del componente hijo info general, con el conjunto de datos valido
     * @param dataModel Modelo de datos
     */
    public obtenerDatosInfoGeneral(dataModel: IdataModelInfoGeneral): void {
        if (dataModel != undefined) {
            this.dataInfoGeneral = dataModel;
            this.valorDefaultServicioArea = this.dataInfoGeneral.servicio._id;
            this.mostrarSigGeneral = false;
            this.esGeneral = false;
            this.mostrarSigAlta = true;
            this.esAlta = true;
            this.mostrarAnt = true;
            this.guardarInfo = false;
            this.esFicha = false;
        }
    }

    public obtenerDatosInfoFicha(dataModel: IdataModelFichaMat): void {
        if (dataModel != undefined) {
            this.dataInfoFicha = dataModel;
            this.mostrarSigGeneral = false;
            this.esGeneral = false;
            this.mostrarSigAlta = false;
            this.esAlta = false;
            this.mostrarAnt = true;
            this.guardarInfo = true;
            this.esFicha = true;
        }
    }

    //Funcion validar campos texto y materiales
    public validar(): void {
        if (this.frmAltaMaterial.valid) {
            console.log('valido');
        } else {
            console.log('invalido');
        }
    }

    //Funcion validar campos texto y materiales
    public validarFicha(): void {
        if (this.frmFichaMaterial.valid) {
            console.log('valido ficha');
        } else {
            console.log('invalido ficha');
        }
    }

    //Funcion validar campos texto y materiales
    public guardar(): void {
        this.documentFormAlta.onSubmit(undefined);
    }

    public limpiar(): void {
        this.msgBox
            .open('QUESTION', 'Precaución', '¿Esta seguro de limpiar los campos?')
            .subscribe((res) => {
                if (res === 'YES') {
                    // Limpiar el formulario
                    this.frmAltaMaterial.reset();
                    // Deshabilita el modo edición
                    this.esEstadoInicialForm = false;
                } else {
                    this.infoGeneralService.restablecerVistaFormulario();
                }
            });
    }

    public CerrarDialogo(): void {
        this.msgBox
            .open('QUESTION', 'Precaución', '¿Esta seguro de cerrar la ventana ?')
            .subscribe((res) => {
                if (res === 'YES') {
                    // Cierra el dialogo completo
                    this.dialogRef.close();
                }
            });
    }



    /**
     * Método en cargado de obtener los tipos de materiaes.
     */
	 private ObtenerCatalogo(): void {
        // Inicia la barra de progreso
        //this.esCargando = true;
        // Se llama a la función del servicio que envia los datos al server
        this.materialesServiciosAltaEditar.List().then(
            (res) => {
                // Oculta la barra de progreso una vez obtenida la respuesta
               // this.esCargando = false;
                // Recibe la respuesta
                // res.exito = true;
                if (res.exito) {
                    // Se asigna los datos a la variable para mostrar la lista de ítems.
                    this.catalogo = res.data;
                    // se almacena el estado inicial de la estructura
                   // this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
                } else {
                    // Muestra el mensaje en el caso de que no se encontraran registros asociados al catálogo
                    this.snackBar.open(res.mensaje, 'Sin datos.', {
                        duration: 5000
                    });
                }
            },
            (err) => {
                // Oculta la barra de progreso en caso de error
               // this.esCargando = false;
                // Muestra el mensaje con el error
                if (err.error) {
                    this.snackBar.open(err.error.message, null, { duration: 5000 });
                }
            }
        );
    }






    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
		// Carga el catálogo de tipos de provincias
		this.ObtenerCatalogo();
    }
}

//Interfaz de Variables
export interface IdataModelAltaMat {
    descMatServ: string;
    estMatServ: string;
    medMatServ: string;
    despMatServ: string;
    otrundMatServ: string;
    tipMatServ: string;
    promdMatServ: number;
    valMatServ: number;
    monedaMatServ: string;
    JustAlta: string;
}

export interface IdataModelFichaMat {
    desctec: string;
    literatura: string;
    certcal: string;
    emppri: string;
    empsec: string;
    empter: string;
}
