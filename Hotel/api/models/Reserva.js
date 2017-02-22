/**
 * Reserva.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        numeroHuespedes: {
            type: "string"
        },
        idUsuario: {
            model: "Usuario"
        },
        idHabitacion: {
            model: "Habitacion"
        },
        Huespedes: {
            collection: "HuespedReserva",
            via: "idReserva"
        }

    }
};