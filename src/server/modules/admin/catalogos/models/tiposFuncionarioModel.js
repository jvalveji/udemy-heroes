// Definición para el fichero tiposFuncionarioModel.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Yendri González Sánchez <yvgonzals@ccss.sa.cr>
// Descripción: Definición del modelo TIPOS_FUNCIONARIO de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let tipoFuncionarioSchema = new Schema({
    'idSIAH': Number,
    'descripcion': String,
    'estado': Boolean,
    'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-funcionario-tipos', tipoFuncionarioSchema); }
