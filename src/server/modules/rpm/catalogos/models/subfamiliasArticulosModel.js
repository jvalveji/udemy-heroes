// Definición para el fichero gruposArticulosModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Descripción: Definición del modelo subClases_Articulos de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'rpm');


let subfamiliasArticulosSchema = new Schema({
    'id_subfamilia': Number,
    'descripcion': String,
    'estado': Boolean,
    'id_familia': Schema.Types.ObjectId,
});

if (dbCore) { module.exports = dbCore.model('catalogo-articulos-subfamilias', subfamiliasArticulosSchema); }