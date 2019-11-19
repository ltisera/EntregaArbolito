var DNI = 0;

$(document).ready(function(){
    console.log("INDICE")
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

            var txtHTM = "<div class='clsMargen'> Sus Divisas"
            
            for (r in response){
                txtHTM += "<br>" + response[r].divisas_simbolo + ": " + response[r].cantidad;
            }
            $("#idContenidoConsultar").html(txtHTM + "</div>");
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

function cargarSelDeDivisas(){
    console.log("carga la lista de compraventa")
    $(".clsSelDivisa").html("")
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
