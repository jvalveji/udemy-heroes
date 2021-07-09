// Definición para el fichero preferenciasModel.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo PREFERENCES para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../../config/db')('mixin', 'core');

let preferenceSchema = new Schema({
	aplicacion_id: Schema.Types.ObjectId,
	usuario_id: Schema.Types.ObjectId,
	temaApp: String
});

if (dbCore) { module.exports = dbCore.model('usuarios-preferencias', preferenceSchema); }
