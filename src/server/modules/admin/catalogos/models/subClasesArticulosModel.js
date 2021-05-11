// Definición para el fichero subClasesArticulosModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Descripción: Definición del modelo subClases_Articulos de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');


let subClasesArticulosSchema = new Schema({
	'descripcion': String,
	'clase_id': Schema.Types.ObjectId,
	'idSIGES': String,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-articulos-subclase', subClasesArticulosSchema, 'catalogo-articulos-subclase'); }
