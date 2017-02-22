/**
 * RutasController
 *
 * @description :: Server-side logic for managing rutas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res) {
        return res.view('vistas/habitaciones/busquedaHabitacion');
    },

    error: function (req, res) {
        return res.view('vistas/error', {
            error: {
                desripcion: "Usted esta por error en esta Ruta dirijase a Inicio",
                rawError: "Ruta equivocada",
                url: "/"
            }
        });
    },

    busqueda: function (req, res) {

        var parametros = req.allParams();

        sails.log.info(parametros.tipoHabitacion);

        if (parametros.fechaInicio >= parametros.fechaSalida) {
            return res.view('vistas/error', {
                error: {
                    desripcion: "La fecha de salida del Hotel debe ser mayor a la fecha de entrana, como mínimo un día",
                    rawError: "No envia fechas correctas",
                    url: "/"
                }
            });
        } else {
            
            var tipo2=parametros.tipoHabitacion;
            sails.log.info(tipo2);
            
            if (tipo2= "Dobles") {
                Habitacion.find({
                    where: {
                        tipo: 'simple'
                    },
                    sort: 'precio DESC'
                }).exec(function (err, habitaciones) {

                    if (err) {
                        return res.view('vistas/error', {
                            error: {
                                desripcion: "No hay habitaciones disponibles para los parametros ingresados",
                                rawError: err,
                                url: "/"
                            }
                        });
                    } else {
                        sails.log.info(habitaciones);
                        return res.view('vistas/habitaciones/habitacionesDisponibles', {
                            habitaciones: habitaciones
                        });
                    }
            




                });

            }
            



        }

    },


    setCookie: function (req, res) {

        var parametros = req.allParams();

        var reservaCookie = req.cookies.reserva;

        sails.log.info(parametros.numHabitacion);

        sails.log.info(parametros.numHuespedes);

        sails.log.info(reservaCookie);

        var nuevaReserva = {
            numHabitacion: parametros.numHabitacion,
            numHuespedes: parametros.numHuespedes,
        }

        if (reservaCookie) {

            sails.log.info("reservaCookie");
            sails.log.info(reservaCookie);

            for (var i = 0; i < reservaCookie.length; i++) {
                if (parametros.numHabitacion == reservaCookie[i].numHabitacion) {
                    return res.badRequest("Ya tiene esa reserva");
                }
            }

            reservaCookie.push(nuevaReserva);

            res.cookie('reserva', reservaCookie);
            return res.ok(reservaCookie);

        } else {

            res.cookie('reserva', [nuevaReserva]);

            return res.ok(nuevaReserva);

        }









    },
    getCookie: function (req, res) {
        return res.ok(req.cookies.reserva);


    },
    crearVarios: function (req, res) {

        var reservas = [
            {
                idUsuario: 1,
                idHabitacion: 1,
                numeroHuespedes: 4
        },
            {
                idUsuario: 1,
                idHabitacion: 2,
                numeroHuespedes: 2
        },
            {
                idUsuario: 1,
                idHabitacion: 3,
                numeroHuespedes: 6
        }];


        var huespedes = [
            {
                idReserva: 1,
                nombre: "asdasd",
                correo: "a@a.com"
        }, {
                idReserva: 1,
                nombre: "123123",
                correo: "a@a.com"
        },
            {
                idReserva: 1,
                nombre: "ssdbytdj",
                correo: "a@a.com"
        },
            {
                idReserva: 1,
                nombre: "asodiaposid",
                correo: "a@a.com"
        }];

        Reserva.create(reservas).exec(function (err, RegistrosCreados) {
            return res.ok(RegistrosCreados)
        })



    }
};