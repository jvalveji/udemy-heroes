// Definición para el fichero usuariosModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo LOGIN para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbCore = require('../../../config/db')('mixin', 'core');

let loginSchema = new Schema({
	usuario_id: Schema.Types.ObjectId,
	ultimaConexion: Date
});

if (dbCore) { module.exports = dbCore.model('login', loginSchema); }