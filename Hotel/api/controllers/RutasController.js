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

        //  sails.log.info("Parametrosssssss11111111 " + parametros);

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

            //            var fechas =
            //
            //                {
            //                    fechaInicial: parametros.fechaInicio,
            //                    fechaFinal: parametros.fechaSalida
            //                }



            var busquedaCookie = req.cookies.busqueda;

            // sails.log.info(parametros.fechaInicio);
            //            sails.log.info(parametros.fechaSalida);
            //        sails.log.info(busquedaCookie);

            var nuevaBusqueda = {
                nombre: 'cookie',
                fechaInicio: parametros.fechaInicio,
                fechaSalida: parametros.fechaSalida
            }

            if (busquedaCookie) {

                //sails.log.info("reservaCookie");
                //sails.log.info(busquedaCookie);

                res.clearCookie('busqueda');
                res.cookie('busqueda', [nuevaBusqueda]);

            } else {

                res.cookie('busqueda', [nuevaBusqueda]);

            }

            sails.log.info("Cooooooooaaaa: " + req.cookies.busqueda);

            var objetoBusqueda = {}

            if (parametros.simple == "on" && parametros.doble == "on" && parametros.triple == "on") {
                objetoBusqueda.tipo = ['simple', 'doble', 'triple'];
            } else {
                if (parametros.simple == "on" && parametros.doble == "on") {
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
            //sails.log.info(objetoBusqueda);

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
                        
                        sails.log.info(habitaciones);

                        var indices = new Array();

                        for (var i = 0; i < habitaciones.length; i++) {

                            for (var j = 0; j < habitaciones[i].Reservas.length; j++) {

                                //                                sails.log.info("Reserva inicio " + habitaciones[i].Reservas[j].fechaInicioReserva.toLocaleDateString());
                                //                                sails.log.info("Reserva fin " + habitaciones[i].Reservas[j].fechaFinReserva.toLocaleDateString());
                                //                                sails.log.info("Inicio " + parametros.fechaInicio);
                                //                                sails.log.info("Salida " + parametros.fechaSalida);

                               // sails.log.info("Iniciooooooo11111 " + habitaciones[i].Reservas[j].fechaInicioReserva);

                                var inicioRes = new Date(habitaciones[i].Reservas[j].fechaInicioReserva);
                                inicioRes.setDate(inicioRes.getDate() + 1);

                                var finRes = new Date(habitaciones[i].Reservas[j].fechaFinReserva);
                                finRes.setDate(finRes.getDate() + 1);

//                                sails.log.info("Iniciooooooo " + inicioRes);
//                                sails.log.info("Salidaaaaaaa " + finRes);

                                if (parametros.fechaInicio <= finRes.toLocaleDateString() && inicioRes.toLocaleDateString() <= parametros.fechaSalida) {

                                    sails.log.info("Holaaaaa" + habitaciones[i].Reservas[j].fechaInicioReserva.toLocaleDateString());
                                    sails.log.info(habitaciones[i].Reservas[j].fechaInicioReserva);
                                    
                                    indices.push(habitaciones[i].id);
                                    //j=habitaciones[i].Reservas.length;
                                   // habitaciones.splice(i, 1);
                                    
                                    sails.log.info("iiiiiiiiiiiiiiii"+i)

                                    //indices.push(i);


                                }


                            }



                        }
                        for (var i = 0; i < indices.length; i++) {
                            
                            var index=-1;
                            
                            for(var j=0; j<habitaciones.length; j++ )
                                {
                                    if(habitaciones[j].id==indices[i])
                                        {
                                            index=j;
                                        }
                                }
                            
                            
                            habitaciones.splice(index, 1);
                            
                            
                        }


                        sails.log.info("1111111111111111111122222222222", habitaciones);

                        var co = req.cookies.busqueda;
                        sails.log.info("Coooooooo: " + co);

                        return res.view('vistas/habitaciones/habitacionesDisponibles', {
                            habitaciones: habitaciones
                        });
                    }


                });

        }

    },


    seleccionHabitaciones: function (req, res) {

        var parametros = req.allParams();

        // sails.log.info("Parametrosssssss " + parametros);


        //        var fechas = {
        //            fechaInicial: parametros.fechaInicial,
        //            fechaFinal: parametros.fechaFinal
        //        }

        // sails.log.info("Parametros");


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

                    // sails.log.info(habitaciones);
                    //                    sails.log.info("fechas" + fechas);

                    return res.view('vistas/habitaciones/ingresarHuespedes', {
                        habitaciones: habitaciones
                    });
                }

            })
    },


    informacionReserva: function (req, res) {


        var parametros = req.allParams();
        var misCookies;
        //        var fechInicial = Date.parse(req.cookies.busqueda[0].fechaInicio);
        //        var fechFinal = Date.parse(req.cookies.busqueda[0].fechaSalida);
        var fechInicial = req.cookies.busqueda[0].fechaInicio;
        var fechFinal = req.cookies.busqueda[0].fechaSalida;
        sails.log.info("Mis cookiessssssssssaaa: " + fechInicial);
        sails.log.info("Mis cookiessssssssssss: " + fechFinal);

        //            fechaFinal: parametros.fechaFinal
        //        }
        var indices = parametros.ides;

        sails.log.info(parametros);

        var numerosHues = 0;

        for (var i = 0; i < parametros.numHuespedes.length; i++) {
            numerosHues += (parametros.numHuespedes[i] * 1);
        }

        sails.log.info("Numero de huespedes: " + numerosHues);

        Usuario.findOne({
                correo: parametros.correo

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

                if (!usuarioEncontrado) {
                    res.view('vistas/Error', {
                        error: {
                            desripcion: "Usuario no encontrado",
                            rawError: errorIndefinido,
                            url: "/"
                        }
                    });
                }

                sails.log.info("Usuario " + usuarioEncontrado);

                for (var i = 0; i < indices.length; i++) {


                    var reservaCrear = {
                        numeroHuespedes: numerosHues,
                        fechaInicioReserva: fechInicial,
                        fechaFinReserva: fechFinal,
                        idUsuario: usuarioEncontrado.id,
                        idHabitacion: indices[i]

                    }
                    sails.log.info("Reserva  " + reservaCrear.numeroHuespedes);
                    sails.log.info("Reserva  " + reservaCrear.fechaInicialReserva);
                    sails.log.info("Reserva  " + reservaCrear.fechaFinReserva);
                    sails.log.info("Reserva  " + reservaCrear.idUsuario);
                    sails.log.info("Reserva  " + reservaCrear.idHabitacion);

                    Reserva.create(reservaCrear).exec(function (err, reservaCreada) {

                        if (err) {
                            res.view('vistas/Error', {
                                error: {
                                    desripcion: "Hubo un problema carga del usario",
                                    rawError: err,
                                    url: "/"
                                }
                            });
                        }
                        
                        if(reservaCreada)
                            {
                                
                            }
                        sails.log.info("Reserva 1 " + reservaCreada);

                    })
                }


                sails.log.info("Ya termino" + numerosHues);
                return res.view('vistas/habitaciones/informacionHuespedes', {
                    numerosHues: numerosHues,
                    indices: indices
                });

            })





    },
    
    
    pagoReserva : function(req, res){
     
                return res.view('vistas/habitaciones/pagoReserva', {
                
                });  
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
        //res.ok(req.cookies.busqueda);

        var co = req.cookies.busqueda;
        sails.log.info(co);
        return res.ok(co);


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