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

        if (parametros.fechaInicio >= parametros.fechaSalida) {
            return res.view('vistas/error', {
                error: {
                    desripcion: "La fecha de salida del Hotel debe ser mayor a la fecha de entrana, como mínimo un día",
                    rawError: "No envia fechas correctas",
                    url: "/"
                }
            });
        } else {

            //guardar cookies



            var parametros = req.allParams();

            var busquedaCookie = req.cookies.busqueda;

            sails.log.info(parametros.fechaInicio);

            sails.log.info(parametros.fechaSalida);

            sails.log.info(busquedaCookie);

            var nuevaBusqueda = {
                fechaInicio: parametros.fechaInicio,
                fechaSalida: parametros.fechaSalida,
            }

            if (busquedaCookie) {

                sails.log.info("reservaCookie");
                sails.log.info(busquedaCookie);

                res.clearCookie('busqueda');

            } else {

                res.cookie('busqueda', [nuevaBusqueda]);

            }


            var objetoBusqueda = {}

            if (parametros.simple == "on" && parametros.doble == "on" && parametros.triple == "on") {
                objetoBusqueda.tipo = ['simple', 'doble', 'triple'];
            } else {
                if (parametros.simple == "on" && parametros.doble == "on" ) {
                    objetoBusqueda.tipo = ['simple', 'doble'];
                    sails.log.info("aaaaaaaa");
                } else {
                    if (parametros.simple == "on" && parametros.triple == "on") {
                        objetoBusqueda.tipo = ['simple', 'triple'];
                    } else {
                        if (parametros.doble == "on" && parametros.triple == "on") {
                            objetoBusqueda.tipo = ['doble', 'triple'];
                        } else {
                            if (parametros.simple == "on") {
                                objetoBusqueda.tipo = 'simple';
                            } else {
                                if (parametros.doble == "on") {
                                    objetoBusqueda.tipo = 'doble';
                                } else {
                                    if (parametros.triple == "on") {
                                        objetoBusqueda.tipo = 'triple';
                                    }
                                }
                            }
                        }
                    }
                }
            }
            sails.log.info(objetoBusqueda);

            Habitacion.find({
                    where: objetoBusqueda,
                    sort: 'precio DESC'
                })
                .populate("Reservas")
                .exec(function (err, habitaciones) {

                    if (err) {
                        return res.view('vistas/error', {
                            error: {
                                desripcion: "No hay habitaciones disponibles para los parametros ingresados",
                                rawError: err,
                                url: "/"
                            }
                        });
                    } else {


                        var indices = new Array();

                        for (var i = 0; i < habitaciones.length; i++) {

                            for (var j = 0; j < habitaciones[i].Reservas.length; j++) {

                                sails.log.info("Reserva inicio " + habitaciones[i].Reservas[j].fechaInicioReserva.toLocaleDateString());
                                sails.log.info("Reserva fin " + habitaciones[i].Reservas[j].fechaFinReserva.toLocaleDateString());
                                sails.log.info("Inicio " + parametros.fechaInicio);
                                sails.log.info("Salida " + parametros.fechaSalida);


                                var inicioRes = new Date(habitaciones[i].Reservas[j].fechaInicioReserva);
                                inicioRes.setDate(inicioRes.getDate() + 1);

                                var finRes = new Date(habitaciones[i].Reservas[j].fechaFinReserva);
                                finRes.setDate(finRes.getDate() + 1);

                                sails.log.info("Iniciooooooo " + inicioRes);
                                sails.log.info("Salidaaaaaaa " + finRes);

                                if (parametros.fechaInicio <= finRes.toLocaleDateString() && inicioRes.toLocaleDateString() <= parametros.fechaSalida) {

                                    sails.log.info("Holaaaaa" + habitaciones[i].Reservas[j].fechaInicioReserva.toLocaleDateString());
                                    sails.log.info(habitaciones[i].Reservas[j].fechaInicioReserva);
                                    //j=habitaciones[i].Reservas.length;
                                    //habitaciones.splice(i,1); 

                                    indices.push(i);


                                }


                            }



                        }
                        for (var i = 0; i < indices.length; i++) {
                            habitaciones.splice(indices[i], 1);
                        }


                        sails.log.info(habitaciones);

                        return res.view('vistas/habitaciones/habitacionesDisponibles', {
                            habitaciones: habitaciones
                        });
                    }


                });

        }

    },


    seleccionHabitaciones: function (req, res) {

        var parametros = req.allParams();

        sails.log.info(parametros.id.length);

        for (var i = 0; i < parametros.id.length; i++) {
            sails.log.info(parametros.id[i])

        }
        Habitacion.find({
                where: parametros,
                sort: 'precio DESC'
            })
            .populate("Reservas")
            .exec(function (err, habitaciones) {

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

                    return res.view('vistas/habitaciones/ingresarHuespedes', {
                        habitaciones: habitaciones
                    });
                }


            });



    },
    
    
    informacionReserva: function (req, res){
        

            var parametros = req.allParams();
            var numHues;
        
            sails.log.info(parametros);
        
            for(var i=0; i<parametros.numHuespedes.length; i++){
                numHues+=parametros.numHuespedes[i];
            }

            if (parametros.nombres && parametros.apellidos) {

            Usuario.find(
            {
                correo:parametros.correo
            })
                        .exec(function (errorIndefinido, usuarioEncontrado) {

                            if (errorIndefinido) {
                                res.view('vistas/Error', {
                                    error: {
                                        desripcion: "Hubo un problema carga del usario",
                                        rawError: errorIndefinido,
                                        url: "/"
                                    }
                                });
                            }
                
                var fechas= req.cookies.busqueda;
                
                sails.log.info("Coookie"+fechas);

                          var reservaCrear ={
                numeroHuespedes:numHues
                              
            }
  
                        })
                


            } else {

                return res.view('vistas/Error', {
                    error: {
                        desripcion: "Llena todos los parametros, apellidos y nombres",
                        rawError: "Fallo en envio de parametros",
                        url: "/CrearUsuario"
                    }

                });

            }


         
        
        
    },
    
    

    setCookieSeleccion: function (req, res) {
        var parametros = req.allParams();
        var habitacionesCookie = req.cookies.habitacion;

        sails.log.info(parametros.idHabitacion);
        sails.log.info(parametros.codigoHabitacion);

        sails.log.info(habitacionesCookie);

        var nuevaHabitacion = {
            idHabitacion: parametros.idHabitacion,
            codigoHabitacion: parametros.codigoHabitacion
        }

        if (habitacionesCookie) {

            if (habitacionesCookie.length >= 1) {

                sails.log.info("habitacionesCookie");
                sails.log.info(habitacionesCookie);

                for (var i = 0; i < habitacionesCookie.length; i++) {
                    if (parametros.idHabitacion == habitacionesCookie[i].idHabitacion) {
                        return res.badRequest("Ya tiene esa reserva");
                    }
                }

                habitacionesCookie.push(nuevaHabitacion);

                res.cookie('habitacion', habitacionesCookie);
                // return res.ok(habitacionesCookie);
                // return res.view('vistas/habitaciones/habitacionesDisponibles');
                // return res.cookie(); 
                // res.cookie('habitacion', [nuevaHabitacion]);
                return res.send(500);

            }
        } else {

            res.cookie('habitacion', [nuevaHabitacion]);

            return res.ok(nuevaHabitacion);

        }




    },

    getCookieHabitacion: function (req, res) {
        res.ok(req.cookies.habitacion);
        return res.send(200);


    },


    deleteCookieHabitacion: function (req, res) {
        res.clearCookie('habitacion');

        return res.send(200);


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