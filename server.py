from flask import Flask, send_from_directory, render_template, jsonify, request
import requests

from DAO.UsuarioDAO import UsuarioDAO
#Fixer IO presonal api key
#
#38a0f63c483d5b0b1819e315606fb6aa

app = Flask(__name__)

@app.route('/')
def inicialPagina():
    return render_template('index.html')

@app.route("/cotizar", methods=["POST"])
def cotizar():
    uri = "http://data.fixer.io/api/latest?access_key=38a0f63c483d5b0b1819e315606fb6aa&symbols=USD,AUD,CAD,PLN,MXN,ARS,EUR"
    quedato = requests.get(uri)
    return quedato.json()

"""
Api RESTFul
"""
@app.route('/test', methods=['POST'])
def cargarUsuario():
    print("Estoy dentro de mi test")
    return "409",200


@app.route('/iniciarSesion', methods=['POST'])
def iniciarSesion():
    udao = UsuarioDAO()
    usuario = udao.iniciarSesion(request.values["nick"], request.values["passwrd"])
    if (usuario is None):
        return jsonify("usuario no encontrado"), 300
    return jsonify(usuario), 200


@app.route('/traerDivisas', methods=['GET'])
def traeDivisas():
    udao = UsuarioDAO()
    listaDivisas = udao.traerDivisas()
    return jsonify(listaDivisas)

@app.route('/depositarDivisas', methods=['POST'])
def depositarDivisas():
    udao = UsuarioDAO()
    listo = udao.depositarDivisas(request.values["dni"], request.values["simbolo"], request.values["cantidad"])
    return jsonify(listo), 200

@app.route('/retirarDivisas', methods=['POST'])
def retirarDivisas():
    udao = UsuarioDAO()
    listo = udao.retirarDivisas(request.values["dni"], request.values["simbolo"], request.values["cantidad"])
    return jsonify(listo), 200


@app.route('/nuevoUsuario', methods=['POST'])
def nuevoUsuario():
    udao = UsuarioDAO()
    dni = request.values["dni"]
    nick = request.values["nick"]
    passwrd = request.values["passwrd"]
    nombre = request.values["nombre"]
    apellido = request.values["apellido"]
    saldoInicial = request.values["saldoInicial"]
    print("ME LLEGA")
    print(dni, nick, passwrd, nombre, apellido, saldoInicial)
    print("WESA")
    udao.nuevoUsuario(dni, nick, passwrd, nombre, apellido, saldoInicial)
    print(request.values)
    return "409", 200

@app.route('/consultarDivisasUsuario/<int:dni>', methods=['GET'])
def consultarDivisasUsuario(dni):
    udao = UsuarioDAO()
    divisas = udao.consultarDivisas(dni)
    return jsonify(divisas), 200



@app.route('/consultarDivisas', methods=['POST'])
def consultarDivisas():
    udao = UsuarioDAO()
    dni = request.values["dni"]
    divisas = udao.consultarDivisas(dni)
    return jsonify(divisas), 200

@app.route('/usuarioCompraDivisa', methods=['POST'])
def usuarioCompraDivisa():
    dni = request.values["dni"]
    divisaCompro = request.values["divisaQueCompro"]
    divisaPago = "ARS"
    cantidadQueQuiero = request.values["cantidad"]
    udao = UsuarioDAO()
    cantidadQueTengo = 0
    divisas = udao.consultarDivisas(dni)
    print("TENGO FOR")
    for d in divisas:
        if(d["simbolo"]==divisaPago):
            cantidadQueTengo = d["cantidad"]
    print(dni)
    print(divisaCompro)
    print(divisaPago)
    print(cantidadQueQuiero)
    print("De esto dispongo")
    print(divisas)

    uri = "http://data.fixer.io/api/latest?access_key=38a0f63c483d5b0b1819e315606fb6aa&symbols=USD,AUD,CAD,PLN,MXN,ARS,EUR"
    cotizaciones = requests.get(uri)
    datosCot = cotizaciones.json()
    precioCompro = datosCot["rates"][divisaCompro]
    precioPago = datosCot["rates"][divisaPago]
    print("Estas son las cotizaciones")
    print("Esto vale ", divisaCompro, ": ", datosCot["rates"][divisaCompro])
    print("Esto vale ", divisaPago, ": ", datosCot["rates"][divisaPago])
    print("Esto es la cantidad que tengo de ", divisaPago, ": ", cantidadQueTengo)
    if((divisaPago == "Opcion") or (divisaCompro == "Opcion") or (divisaPago == divisaCompro)):
        return("err"),400
    
    if(( float(cantidadQueQuiero) *  float(precioPago) /  float(precioCompro)) <  float(cantidadQueTengo)):
        udao.depositarDivisas(dni,divisaCompro, cantidadQueQuiero)
        return jsonify("200"), 200
    else:
        print("EstasPOBRE CULEAO")
        return jsonify("40"), 400
    return jsonify("200"), 200



"""
Devuelve Archivos que se encuentren dentro de la carpeta static
/static/<dir>/nombreDeArchivo.ext
""" 

@app.route('/static/<path:path>')
def sirveDirectorioSTATIC(path):
    sPath = path.split("/")
    directorio = ""
    if(len(sPath) == 1):
        directorio = ""
        arc = sPath[len(sPath) - 1]
    else:
        for i in range(len(sPath) - 1):
            directorio = directorio + sPath[i] + "/"
        directorio = directorio[0:- 1]
        arc = sPath[len(sPath) - 1]
    directorio = "static/" + directorio
    return send_from_directory(directorio, arc)

@app.route('/favicon.ico', methods=['GET'])
def devolveFavicon():
    return send_from_directory("static/img", "favicon.ico")

#

app.run(debug=True)