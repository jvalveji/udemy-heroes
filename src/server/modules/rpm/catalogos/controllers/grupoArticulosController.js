// Definición para el fichero tipoMaterialController.js v2.0.0
// Proyecto: Bitzu - MEAN
// Definiciones por: Ing. Jorge Luis Castro Godinez <jlcastrog@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de Tipo Materiales para interactuar la base de datos mongo.
// Modificado: (29-06-2021) Jorge Luis Castro Godinez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('../models/grupoArticulosModel');
// instancia a la libreria de mongoose
const mongoose = require('mongoose');
// Módulo async para manejo solicitudes asincronas
const async = require('async');
// Se incluye el fichero de funciones utilitarias
const utils = require('../../../shared/services/utilidadesService');

/**
 * broadcastController.js

 * @description :: Server-side logic for managing broadcasts.
 */
module.exports = {

    /**
     * @description Método encargado de listar todos las monedas disponibles en la base de datos
     */
    /**
     * tipoMaterial.getTipoMaterial()
     * Función encargada de  listar los tipos materiales exitentes
     */

    list: function(req, res) {
        // Variable que establece el filtro de la consulta a la base de datos (WHERE)
        const _where = {};
        // Busca la información del catalogo
        catalogoModel.find(_where, function(err, catalogos) {
            if (err) {
                return res.status(500).json({
                    message: 'No se pudo obtener los grupos de articulos.',
                    error: err
                });
            }
            if (!catalogos) {
                return res.status(404).json({
                    message: 'No existe la definición del catálogo.'
                });
            }
            // Se crea un objeto respuesta y los datos se encapsulan en este
            const respuesta = new HttpResponse(true, null, catalogos);
            // Se obtiene el JSON del mensaje y se envia (200 = OK)
            return res.status(200).send(respuesta.getJSON());
        }).sort({
            'descripcion': 1
        });
    },

    /*
     * showByIdTipoMaterial.showByidTipoMaterial()
     * Método encargado de obtener un Tipo Material por su código
     */

    // Metodo para buscar un documento en especifico
    showByGrupo: (req, res) => {
        //recoger el id
        const idGrupoMaterial = req.params.id;

        // verificar la exitencia del id
        if (!idGrupoMaterial || idGrupoMaterial == null) {
            return res.status(404).send({
                status: 'error',
                menssage: 'No existe el Artículo!!!'
            });
        }

        // buscar el Tipo Material
        catalogoModel.findById(idGrupoMaterial, (err, catalogos) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    menssage: 'Error al obtener el catálogo.'
                });
            }
            if (!catalogos) {
                return res.status(404).send({
                    status: 'error',
                    menssage: 'No existe la definición del catálogo.'
                });
            }

            // Se crea un objeto respuesta y los datos se encapsulan en este
            const respuesta = new HttpResponse(true, null, catalogos);
            // Se obtiene el JSON del mensaje y se envia (200 = OK)
            return res.status(200).send(respuesta.getJSON());
        })


    },



};
