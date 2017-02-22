/**
 * HabitacionController
 *
 * @description :: Server-side logic for managing Habitacions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    ingresarHabitaciones: function (req, res) {


        if (req.method == "POST") {

            var parametros = req.allParams();

            if (parametros.codigo && parametros.piso && parametros.precio && parametros.tipo && parametros.estado) {

                var nuevaHabitacion = {
                    codigo: parametros.codigo,
                    piso: parametros.piso,
                    precio: parametros.precio,
                    tipo: parametros.tipo,
                    estado: parametros.estado

                }

                Habitacion.create(nuevaHabitacion).exec(function (err, nuevaHabitacion) {

                    if (err) {
                        return res.view('vistas/Error', {
                            error: {
                                desripcion: "Fallo al ingresar la habitacion",
                                rawError: err,
                                url: "/"
                            }

                        });
                    }

                    Habitacion.find()
                        .exec(function (errorIndefinido, habitacionesEncontradas) {

                            if (errorIndefinido) {
                                res.view('vistas/Error', {
                                    error: {
                                        desripcion: "Hubo un problema cargando las habitaciones",
                                        rawError: errorIndefinido,
                                        url: "/"
                                    }
                                });
                            }

                            res.view('vistas/habitacionesDisponibles', {
                                habitaciones: habitacionesEncontradas
                            });
                        })

                })


            } else {

                return res.view('vistas/Error', {
                    error: {
                        desripcion: "Llenar todos los parametros,codigo, piso, precio, tipo, estado",
                        rawError: "Fallo en envio de parametros",
                        url: "/"
                    }

                });

            }


        } else {

            return res.view('vistas/Error', {
                error: {
                    desripcion: "Error en el uso del Metodo HTTP",
                    rawError: "HTTP Invalido",
                    url: "/"
                }
            });

        }

    }




};