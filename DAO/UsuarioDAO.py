import mysql.connector
import sys


import random
from DAO.ConexionDB import ConexionBD



class UsuarioDAO(ConexionBD):
    def __init__(self):
        pass
    def iniciarSesion(self, nick, passwrd):
        try:
            self.crearConexion()
            self.cursorDict()
            consulta = "SELECT * FROM usuario WHERE nick='{}' AND passwrd='{}'".format(nick, passwrd)
            print("ORINTO LA CONSULTAAAAAA")
            print(consulta)
            self._micur.execute(consulta)
            usuario = self._micur.fetchone()
        except mysql.connector.errors.IntegrityError as err:
            print("DANGER ALGO OCURRIO: " + str(err))
        finally:
            self.cerrarConexion()
        return usuario

    def nuevoUsuario(self, dni, nick, passwrd, nombre, apellido, saldoInicial):
        
        try:
            self.crearConexion()
            self.cursorDict()
            consulta = "INSERT INTO usuario (dni, nick, passwrd, nombre, apellido) VALUES ({}, '{}', '{}', '{}', '{}')".format(dni, nick, passwrd, nombre, apellido)
            self._micur.execute(consulta)
    
            consulta = "INSERT INTO usuarioxdivisas (`Usuario_dni`, `divisas_simbolo`, `cantidad`) VALUES ({}, 'ARS', {});".format(dni, saldoInicial)
            print("ConsultaTSTSTSTSTST")
            print(consulta)
            self._micur.execute(consulta)

            
            self._bd.commit()
        except mysql.connector.errors.IntegrityError as err:
            print("DANGER ALGO OCURRIO: " + str(err))
        finally:
            self.cerrarConexion()
        


if __name__ == '__main__':
    udao = UsuarioDAO()
    udao.nuevoUsuario(3,"Nickote","1234","Nico","mati",123.6)
    print("URRA")
