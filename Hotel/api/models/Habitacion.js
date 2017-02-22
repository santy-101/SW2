/**
 * Habitacion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        codigo: {
            type: 'int',
            require: true
        },
        piso: {
            type: 'int',
            require: true
        },
        precio: {
            type: 'float',
            require: true
        },
        tipo: {
            type: 'string',
            enum: ['simple', 'doble', 'triple'],
            require: true
        },
        estado: {
            type: 'boolean',
            require: true
        },
        Reserva: {
            collection: "Reserva",
            via: "idHabitacion"
        }

    }
};