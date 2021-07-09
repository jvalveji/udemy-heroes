// Definición typescript para la interface IPersona v2.2.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (14-03-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './arca-log';

/**
 * Interfaz que representa los datos de una persona
 */
export interface IPersona {
	/**
	 * (opcional) Id del documento
	 */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
	 * Tipo de identificación
	 */
	tipoIdentificacion_id: {
		_id: mongoose.Schema.Types.ObjectId,
		descripcion: string
	};

	/**
	 * Número de identificación
	 */
	identificacion: string;

	/**
	 * Nombre de la persona
	 */
	nombre: string;

	/**
	 * Primer apellido
	 */
	apellido1: string;

	/**
	 * Segundo apellido
	 */
	apellido2: string;

	/**
	 * (opcional) Tipo de genero
	 */
	genero_id?: {
		_id: mongoose.Schema.Types.ObjectId,
		descripcion: string
	};

	/**
	 * (opcional) Fecha de nacimiento
	 */
	fechaNacimiento?: Date;

	/**
	 * (opcional) Provincia de nacimiento
	 */
	provinciaNacimiento?: {
		_id: mongoose.Schema.Types.ObjectId,
		descripcion: string
	};

	/**
	 * (opcional) Datos de los padres
	 */
	datosPadres?: {
		identificacionMadre: number,
		identificacionPadre: number,
		nombreCompletoMadre: string,
		nombreCompletoPadre: string
	};

	/**
	 * (opcional) País de procedencia / Nacionalidad
	 */
	pais_id?: {
		_id: mongoose.Schema.Types.ObjectId,
		nacionalidad: string
	};

	/**
	 * (opcional)  Arreglo con los medios de contacto
	 */
	mediosContacto?: Array<any>;

	/**
	 * Indicador de fallecido
	 */
	esFallecido: boolean;

	/**
	 * (opcional) Fecha de fallecimiento
	 */
	fechaDefuncion?: Date;

	/**
	 * (opcional) Cita defunción ante el registro
	 *
	 * Formato: Asiento-folio-provincia-tomo
	 */
	citaDefuncion?: {
		asiento: string,
		folio: string,
		provincia: string,
		tomo: string
	};

	/**
	 * Indicador cuando la persona posee o no un usuario arca
	 */
	esUsuarioArca: boolean;

	/**
	 * Indicador proceso carga del padrón nacional (TSE)
	 */
	idCargaPadron?: number

	/**
	 * (opcional) Objeto para el manejo del log asociado al documento
	 */
	logs?: IArcaLog;
}
