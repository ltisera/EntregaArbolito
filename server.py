from flask import Flask, send_from_directory, render_template

app = Flask(__name__)

@app.route('/')
def inicialPagina():
    return render_template('index.html')

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


app.run()