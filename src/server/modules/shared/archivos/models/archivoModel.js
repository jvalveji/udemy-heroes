// Definición para el fichero archivoModel.js V2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para definir el schema modelo archivo
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbArchivos = require('./../../../../config/db')('mixin', 'archivos');

let filesSchema = new Schema({
	'filename': String,
	'contentType': String,
	'length': Number,
	'chunkSize': Number,
	'uploadDate': Date,
	'aliases': String,
	'metadata': Array,
	'md5': String
});

if (dbArchivos) { module.exports = dbArchivos.model('fs.files', filesSchema); }
