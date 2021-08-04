import { MaterialesServiciosModificarEditarComponent } from './../materiales-servicios-modificar-editar/materiales-servicios-modificar-editar.component';
// Definición typescript para el componente materiales-servicios-modificar-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    Inject,
    Optional
} from '@angular/core';
import { cloneDeep } from 'lodash';
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
import { compact } from 'lodash';
import { AutocompleteComponent } from 'app/shared/controls/autocomplete/autocomplete.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { any } from 'sequelize/types/lib/operators';

@Component({
    selector: 'bitzu-materiales-servicios-acceso-editar',
    templateUrl: './materiales-servicios-acceso-editar.component.html',
    styleUrls: ['./materiales-servicios-acceso-editar.component.scss'],

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
export class MaterialesServiciosAccesoEditarComponent implements OnInit {
    /**
     * Variable que maneja la clase para el tema
     */
    public temaApp: string;

    public defaultValue: string;

    /**
     * Variable que maneja los eventos de siguiente y anterior entre pantallas
     */
    public mostrarSig: boolean = true;
    public mostrarAnt: boolean = false;
    public guardarInfo: boolean = false;

    /** 
	Datos de formulario de informacion general para manipular la información y se traslada a otros componentes
	*/
    public frmAcceso: FormGroup;

    /**
     *Variable para indicar si el formulario se debe resetar a un estado inicial
     */
    public esEstadoInicialForm = false;

    /**
     * Variable para recibir los datos de forma temporal y cargarlos al formgroup
     */
    private datos: IdataModelAcceso;

    /**
     * Variable para mostrar/ocultar la barra de progreso
     */
    public esCargando = false;

    /**
     * Datos obtenidos del formulario info general
     */
    public dataInfoGeneral: IdataModelInfoGeneral;

    /**
     * Variable que contiene el valor por defecto del servicio
     */
    public valorDefaultServicioArea: string;

    /**
     * Se "instancia" el componente de autocompletar (en el html) para accederlo
     * */
    @ViewChild('serviciosAutoComplete')
    serviciosAutoComplete: AutocompleteComponent;

    /**
     * Propiedad decorativa para acceder al componente desde el HTML
     */
    @ViewChild('infoGeneralService')
    infoGeneralService: InfoGeneralComponent;

    /**
     * Variable para poder acceder al evento submit del formulario reactivo
     */
    @ViewChild('documentFormAcceso')
    documentFormAcceso: FormGroupDirective;

    /**
     * Se declara arreglo para el combo de materiales
     */
    public materiales: any = [
        { _id: '1', descripcion: 'Circuito Respiratorio', idMaterial: 1 },
        { _id: '2', descripcion: 'Locoregional', idMaterial: 2 },
        { _id: '3', descripcion: 'Neuroaxial', idMaterial: 3 },
        { _id: '4', descripcion: 'Radiofrecuencia', idMaterial: 4 },
        { _id: '5', descripcion: 'Arnes', idMaterial: 5 }
    ];

    /**
     * Arreglo donde se almacenan los valores seleccionados del combo
     */
    public mat_sel: any = [];

    /**
     * Metodo para declarar e inicializar variables
     */
    public item: {
        _id: String;
        descripcion: String;
    } = {
        _id: '',
        descripcion: ''
    };

    /**
     * Metodo para setear las variables
     */
    setItem(mat: any) {
        this.item._id = mat._id;
        this.item.descripcion = mat.descripcion;
    }

    /**
     * Metodo para agregar datos al arreglo al temporal
     */
    agregarMaterial() {
        if (!this.ExisteMaterial()) {
            //Se agregar los valores al arregalo
            this.mat_sel.push(cloneDeep(this.item));
            //Se ordenan los valores
            let sort_mat_sel = this.mat_sel.sort(
                (first, second) => 0 - (first._id > second._id ? -1 : 1)
            );
            console.log(this.item);
            console.log(this.mat_sel);
        } else {
            this.msgBox.open('WARNING', 'Advertencia', 'No se pueden ingresar codigos duplicados');
        }
    }

    /**
     * Metodo para verificar la existencia de materiales duplicados en el arreglo
     */
    public ExisteMaterial(): boolean {
        if (this.mat_sel.length === 0) {
            return false;
        }
        // Se recorre el arreglo de los materiales de la aplicación
        return this.mat_sel.some((material) => {
            // valida si existe el elemento
            if (material._id === this.item._id) {
                // Retorna verdadero y sale del ciclo
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * Funcion para eliminar elementos de matriz
     */
    public eliminarMaterial(){
        for (let i = 1; i < this.mat_sel.length; ) {
            if (this.mat_sel[i] !== this.item._id) {
                delete this.mat_sel[i];
            }
        }
        console.log(this.mat_sel);
    }

    /**
     * Variable que maneja el estado del estatus de la selección para el servicio o área
     */
    public serviciosAutoCompleteStatus: boolean = false;

    /**
     * Atributo de salida que retorna el conjunto de datos dados por el usuario
     */
    @Output('validarItem')
    private validarItem: EventEmitter<IdataModelInfoGeneral> = new EventEmitter<IdataModelInfoGeneral>();

    constructor(
        public dialogRef: MatDialogRef<MaterialesServiciosAccesoEditarComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private utilidadesService: UtilidadesService,
        private fb: FormBuilder,
        private msgBox: DialogService
    ) {
        this.frmAcceso = this.fb.group({
            codigo: [null, Validators.required],
            descripcion: [null, Validators.required],
            justificacion: [null, Validators.required],
            mat_selec: [null, Validators.required]
        });
    }

    /**
     * Metodo para validar Informacion
     */
    public validarInfo() {
        this.mostrarSig = false;
        this.mostrarAnt = true;
        this.guardarInfo = true;
    }

    /**
     * Metodo para devolverse a la lista anterior
     */
    public atras() {
        this.mostrarSig = true;
        this.mostrarAnt = false;
        this.guardarInfo = false;
    }

    //Metodo para limpiar el arreglo
    public limpiarLista() {
        this.mat_sel = [];
    }

    /** Permite restablecer la vista del formulario a un estado inicial */
    public restablecerVistaFormulario(): void {
        if (this.esEstadoInicialForm) {
            this.frmAcceso.reset(); // Limpia el formulario
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
     * Evento que viene del componente hijo info general, con el conjunto de datos valido
     * @param dataModel Modelo de datos
     */
    public obtenerDatosInfoGeneral(dataModel: IdataModelInfoGeneral): void {
        if (dataModel != undefined) {
            this.dataInfoGeneral = dataModel;
            this.valorDefaultServicioArea = this.dataInfoGeneral.servicio._id;
            this.mostrarSig = false;
            this.mostrarAnt = true;
            this.guardarInfo = true;
        }
    }

    /**
     * Funcion para validar campos texto y materiales
     */
    public validar(): void {
        if (this.frmAcceso.valid) {
            console.log('valido');
            this.msgBox.open(
                'WARNING',
                'Informativo',
                'La informacion fue almacenada correctamente.'
            );
        } else {
            console.log('invalido');
        }
    }

    //Funcion para guardar campos
    public guardar(): void {
        this.documentFormAcceso.onSubmit(undefined);
    }

    /**
     * Funcion para limpiar campos textos y matriz de materiales
     */
    public limpiar(): void {
        this.msgBox
            .open('QUESTION', 'Precaución', '¿Esta seguro de limpiar los campos?')
            .subscribe((res) => {
                if (res === 'YES') {
                    // Limpiar el formulario
                    this.frmAcceso.reset();
                    this.limpiarLista();
                    // Deshabilita el modo edición
                    this.esEstadoInicialForm = false;
                } else {
                    this.infoGeneralService.restablecerVistaFormulario();
                }
            });
    }

    /**
     * Funcion para cerrar dialogo
     */
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

    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
    }
}

//Interfaces de Variables
export interface IdataModelAcceso {
    codigo: string;
    descripcion: string;
    justificacion: string;
    mat_selec: string;
}
