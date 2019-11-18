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
            console.log("Bien Iniciar Session")
            console.log(response)
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
            var txtHTM = "Precio Venta <br>"
            
            for (r in response.rates){
                txtHTM += r + ": " + (response.rates.ARS/response.rates[r]).toFixed(2) + "<br>"
                
            }
            
            txtHTM += "<br><br>Precio Compra <br>"
            
            for (r in response.rates){
                txtHTM += r + ": " + ((response.rates.ARS/response.rates[r])*94/100).toFixed(2) + "<br>"
                
            }
            $("#idDivDivisas").html(txtHTM);
        },
        error: function(response){console.log("MAL")},
    });
};