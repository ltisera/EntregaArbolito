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
        return jsonify("usuario no encontrado"), 199  
    return jsonify(usuario), 200


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
    return "409",200



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