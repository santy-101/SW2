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
            required: true
        },
        piso: {
            type: 'int',
            required: true
        },
        precio: {
            type: 'float',
            required: true
        },
        tipo: {
            type: 'string',
            enum: ['simple', 'doble', 'triple'],
            required: true
        },
        estado: {
            type: 'boolean',
            required: true
        },
        Reservas: {
            collection: "Reserva",
            via: "idHabitacion"
        }

    }
};