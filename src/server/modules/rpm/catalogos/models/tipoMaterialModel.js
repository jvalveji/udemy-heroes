// Definición para el fichero tipoMaterialModel.js v5.0.0
// Proyecto: Bitzu RMP - MEAN
// Definiciones por: Jorge Luis Castro Godinez <jlcastrog@ccss.sa.cr>
// Descripción: Definición del modelo TIPO_MATERIAL de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (28-06-2020) Ing. Jorge Luis Castro Godinez.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'rpm');

let tipoMaterialSchema = new Schema({
    'nomenclatura': String,
    'descripcion': String,
    'categoria': String,
    'estado': Boolean,
});

if (dbCore) { module.exports = dbCore.model('catalogo-materiales-servicios-tipos', tipoMaterialSchema, 'catalogo-materiales-servicios-tipos'); }
