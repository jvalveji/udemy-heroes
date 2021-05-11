// Definición para el fichero permisosModel.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo PERMISOS USUARIOS para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../../config/db')('mixin', 'core');

let permisosSchema = new Schema({
	usuario_id: Schema.Types.ObjectId,
	aplicacion_id: Schema.Types.ObjectId,
	unidadProgramatica_id: Schema.Types.ObjectId,
	permiso_id: Schema.Types.ObjectId
});

if (dbCore) { module.exports = dbCore.model('permisos-usuarios', permisosSchema, 'permisos-usuarios'); }
