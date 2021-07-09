// Definición para el fichero tipoMaterialController.js v2.0.0
// Proyecto: Bitzu - MEAN
// Definiciones por: Ing. Jorge Luis Castro Godinez <jlcastrog@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de Tipo Materiales para interactuar la base de datos mongo.
// Modificado: (29-06-2021) Jorge Luis Castro Godinez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const tipoMaterial = require('../models/tipoMaterialModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('../../../shared/services/utilidadesService');
const tipoMaterialModel = require('../models/tipoMaterialModel');
/**
 * broadcastController.js
 
 * @description :: Server-side logic for managing broadcasts.
 */
 module.exports = {

	/**
	 * @name getTipoMateria()
	 * @description Método encargado de listar todos las monedas disponibles en la base de datos
	 */
	/**
	 * tipoMaterial.getTipoMaterial()
	 * Función encargada de  listar los tipos materiales exitentes
	 */
	 
	  getTipoMaterial: (req, res) => {
		//Buscar los Materiales
		var query = tipoMaterial.find();

		// buscar Tipo Material-metodo
		query.sort('-_id').exec((err, material) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					menssage: 'Error al devolver los tipos materiales!!!!!'
				});
			}

			if (!material) {
				return res.status(404).send({
					status: 'error',
					menssage: 'No hay tipo materiales para mostrar!!!'
				});
			}

			return res.status(200).send({
				status: 'success',
				material
			});
		});
	},

    /*
	 * showByIdTipoMaterial.showByidTipoMaterial()
	 * Método encargado de obtener un Tipo Material por su código 
	 */

    // Metodo para buscar un documento en especifico
	showByIdTipoMaterial: (req, res) => {
	//recoger el id
	var idTipoMaterial = req.params.id;
	
	// verificar la exitencia del id
	if(!idTipoMaterial ||idTipoMaterial == null){
	return res.status(404).send({
	status: 'error',
	menssage: 'No existe el Tipo Material!!!'
	});
	}
	
	// buscar el Tipo Material
	tipoMaterial.findById(idTipoMaterial ,(err,data) => {
	if(err){
	return res.status(500).send({
	status: 'error',
	menssage: 'Error al devolver los datos!!!'
	});
	}
	if(!data){
	return res.status(404).send({
	status: 'error',
	menssage: 'No existe la Receta!!!'
	});
	}
	//devolver el Jason
	return res.status(200).send({
	status: 'success',
	data
	});
	
	});
	},
     
	// Metodo que elimina un registro de los Materiales
	 eliminarTipoMaterial: (req, res) => {
		//recoger el id de la receta
 		var idTipoMaterial = req.params.id;
 		// find and delete
 
 		tipoMaterial.findOneAndDelete({_id: idTipoMaterial}, (err, TipoMaterialRemove)=>{
 		if(err){
 		return res.status(500).send({
 		status: 'error',
 		message: 'Error al Borrar el Tipo Material'
 		});
 		}
 	if(!TipoMaterialRemove){
 	return res.status(404).send({
 	status: 'error',
 	message: 'El tipo Material no existe'
 	});
 	}
 
	return res.status(200).send({
	status: 'success',
	TipoMaterialRemove
 	}); 
 });
		
		},
	
    /**
	 * @name modificaTipoMaterial()
	 * @description Método encargado de actualiza el tipoMaterial por medio de su id.
	 */
     modificaTipoMaterial: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
	
		tipoMaterial.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}
			data.set({
				tipo: req.body.tipo,
				descripcion: req.body.descripcion,
				estado: req.body.estado,
			});
			data.save(function (err, data) {
				if (err) {
					// devuelve la respuesta de error
					let respuesta = new HttpResponse(false, 'Error al guardar el registro actualizado', null);
					return res.status(500).send(respuesta.getJSON());
				}
				let respuesta = new HttpResponse(true, 'Registro actualizado con éxito', data);
				// devuelve la respuesta de exito
				return res.status(200).send(respuesta.getJSON());
			 });
		 });
	  },
	
	/**
	 * Material.crearTipoMaterial()
	 * Función encargada de guardar los tipos materiales exitentes
	 */	
	/**
	 * @name crearTipoMaterial()
	 * @description Método encargado de crear un nuevo registro.
	 */
		crearTipoMaterial: function (req, res) {
			// Se crea un nuevo objeto tipo schema mongodb
			var item = new tipoMaterial({
				tipo: req.body.tipo,
				descripcion: req.body.descripcion,
				estado: true,
			});

			item.save(function (err, data) {

				if (err) {
					// devuelve la respuesta de error
					let respuesta = new HttpResponse(false, 'Error al guardar nuevo registro', null);
					return res.status(500).send(respuesta.getJSON());
				}
				let respuesta = new HttpResponse(true, 'Registro agregado con éxito', data);
				// devuelve la respuesta de exito
				return res.status(200).send(respuesta.getJSON());
			});
		},

};
