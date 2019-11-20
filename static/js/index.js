var DNI = 0;

$(document).ready(function(){
    console.log("INDICE")
    $.ajax({
        url: 'ultimosQuince',
        type: 'GET',
        success: function(response){console.log(response)
            var trace1 = {
                x: [1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15],
                y: [
                    response[0],
                    response[1],
                    response[2],
                    response[3],
                    response[4],
                    response[5],
                    response[6],
                    response[7],
                    response[8],
                    response[9],
                    response[10],
                    response[11],
                    response[12],
                    response[13],
                    response[14],
                ],
                type: 'scatter'
              };
              
              var data = [trace1];
              
              Plotly.newPlot('idDivGrafico', data, {}, {showSendToCloud: true});
        },
        error: function(response){console.log(response)}
    });
    
});

$(document).on('click', "#idBtnAjax", function() {
    console.log("Entro al ajax")
    $.ajax({
        url: 'ajaxUsuario',
        type: 'POST',
        data:{
            'usuario': 'Lucs',
            'valor' : 123
        },
        success:function(response){console.log("BIENajax")},
        error:function(response){console.log("malajax")}
    });
});


$(document).on('click', "#idIBtnIniciar", function() {
    console.log("Entro REGISTRAR USUARIO")
    $.ajax({
        url: 'iniciarSesion',
        type: 'POST',
        data:{
            'nick': $("#idIUsuario").val(),
            'passwrd' : $("#idIPasswrd").val(),
            
        },
        success:function(response){
            DNI = response.dni;
            consultarDivisas();
            console.log("Bien Iniciar Session")
            console.log(response)
            console.log(response.dni)
            $("#idDivLogin").toggleClass("ocultar");
            $("#idDivGrafico").toggleClass("ocultar");
            $("#idDivOperar").toggleClass("ocultar");
            $("#idDivDivisas").toggleClass("ocultar");
            mostrarCotizacion();
        },
        error:function(response){alert("Usuaria No valido")}
    });
});




$(document).on('click', "#idBtnRegistrar", function() {
    console.log("Entro REGISTRAR USUARIO")
    $.ajax({
        url: 'nuevoUsuario',
        type: 'POST',
        data:{
            'nick': $("#idRUsuario").val(),
            'passwrd' : $("#idRPasswrd").val(),
            'dni': $("#idRDni").val(),
            'nombre': $("#idRNombre").val(),
            'apellido': $("#idRApellido").val(),
            'saldoInicial': $("#idRSaldoInicial").val()
        },
        success:function(response){
            DNI = $("#idRDni").val();
            consultarDivisas();
            console.log("BIENajax")
            $("#idDivLogin").toggleClass("ocultar");
            $("#idDivGrafico").toggleClass("ocultar");
            $("#idDivOperar").toggleClass("ocultar");
            $("#idDivDivisas").toggleClass("ocultar");
            mostrarCotizacion();
        },
        error:function(response){console.log("malajax")}
    });
});



function mostrarCotizacion(){
    $.ajax({
        url: 'cotizar',
        type: 'POST',
        success: function(response){
            console.log("Expectativa");
            console.log(response);
            console.log("REALIDAD");
            console.log(response.rates);
            var txtHTM = "<div class='clsMargen'> Precio Venta"
            
            for (r in response.rates){
                txtHTM += "<br>" + r + ": " + (response.rates.ARS/response.rates[r]).toFixed(2);
            }
            
            txtHTM += "<br><br><br>Precio Compra"
            
            for (r in response.rates){
                txtHTM += "<br>" + r + ": " + ((response.rates.ARS/response.rates[r])*94/100).toFixed(2);
            }

            txtHTM += "<br><br><input type='button' id='idBotonBorrarCuenta' value='Borrar Cuenta' onClick='borrarCuenta()''>"
            
            $("#idDivDivisas").html(txtHTM + "</div>");

            cargarSelDeDivisas();
        },
        error: function(response){console.log("MAL")},
    });
};

function consultarDivisas(){
    
    $.ajax({
        url: 'consultarDivisasUsuario/'+DNI,
        type: 'GET',
        success: function(response){
            console.log(response);
            $(".clsSelDivisaUsuario").html("")
            $(".clsSelDivisaUsuario").append(new Option("-seleccione una opcion-", "Opcion"))
    
            var txtHTM = "<div class='clsMargen'> Sus Divisas"
            
            for (r in response){
                txtHTM += "<br>" + response[r].divisas_simbolo + ": " + response[r].cantidad;
                $(".clsSelDivisaUsuario").append(new Option(response[r].nombre, response[r].divisas_simbolo))
            }
            $("#idContenidoConsultar").html(txtHTM + "</div>");
        },
        error: function(response){console.log("MAL")},
    });
};

function depositar(){
    $.ajax({
        url: 'depositarDivisas',
        type: 'POST',
        data:{
            'dni': DNI,
            'simbolo': $("#idSelDepositarDivisa").val(),
            'cantidad': $("#idCantidadDepositarDivisa").val(),
        },
        success: function(response){
            console.log(response);
        },
        error: function(response){console.log("MAL")},
    });
};

function retirar(){
    $.ajax({
        url: 'retirarDivisas',
        type: 'POST',
        data:{
            'dni': DNI,
            'simbolo': $("#idSelRetirarDivisa").val(),
            'cantidad': $("#idCantidadRetirarDivisa").val(),
        },
        success: function(response){
            console.log(response);
        },
        error: function(response){console.log("MAL")},
    });
};

$(document).on('click', ".clsOpc", function() {
    $(".clsContenidoOpc").toggleClass("ocultar", true);
    $("#idContenido"+(this.id).substring(5)).toggleClass("ocultar", false);
    if(this.id == "idOpcConsultar"){
        consultarDivisas();
    }
});

$(document).on('click', "#idBtnComprarDivisas", function() {
    $.ajax({
        url: 'usuarioCompraDivisa',
        type: 'POST',
        data: {
            'dni' : DNI,
            'divisaQueCompro' : $("#idSelCompraDivisas").val(),
            'cantidad' : $("#inpCantidadAComprar").val()
        },
        success: function(response){console.log(response)},
        error: function(response){console.log(response)}
    })
});

$(document).on('click', "#idBtnVenderDivisas", function() {
    $.ajax({
        url: 'usuarioVentaDivisa',
        type: 'POST',
        data: {
            'dni' : DNI,
            'divisaQuePago' : $("#idSelVentaDivisas").val(),
            'cantidad' : $("#inpCantidadAVender").val()
        },
        success: function(response){console.log(response)},
        error: function(response){console.log(response)}
    })
});

function cargarSelDeDivisas(){
    console.log("carga la lista de compraventa")
    $(".clsSelDivisa").html("")
    $(".clsSelDivisa").append(new Option("-seleccione una opcion-", "Opcion"))
    $.ajax({
        url: 'traerDivisas',
        type: 'GET',
        success: function(response){
            console.log(response)
            for (r in response){
                $(".clsSelDivisa").append(new Option(response[r].nombre, response[r].simbolo))
            }
        },
        error: function(response){console.log("Error al traer las divisas")}
    });

};

function borrarCuenta(){
    if (confirm("Estas seguro que queres borrar tu cuenta?")) {
        $.ajax({
            url: 'borrarCuenta',
            type: 'POST',
            data: {
                'dni' : DNI,
            },
            success: function(response){
                location.reload();
            },
            error: function(response){console.log("Error al eliminarte")}
        });
    }
}