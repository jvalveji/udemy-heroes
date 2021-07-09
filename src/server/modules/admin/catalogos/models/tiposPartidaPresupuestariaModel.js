// Definición JavaScript para el modelo Tipos de Partida Presupuestaria v2.0.0
// Proyecto: Arca - Nutrición
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (26-05-2020)
// Descripción: Definición del modelo TIPOS DE PARTIDA PRESUPUESTARIA para las operaciones CRUD en la base de datos mongo.
// Modificado: (15-07-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');
const dbNutricion = require('./../../../../config/db')('mixin', 'core');

let tiposPartidaPresupuestariaSchema = new Schema({
	'descripcion': String,
	'codigo': String,
	'estado': Boolean,
	'logs': arcaLog
});

if (dbNutricion) { module.exports = dbNutricion.model('catalogo-presupuestaria-partida-tipos', tiposPartidaPresupuestariaSchema); }
