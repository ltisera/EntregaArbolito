
#modo = 'produccion'
modo = 'desarrollo'


def getConfigDB():
    configDB = {}
    if (modo == 'desarrollo'):
        configDB['host'] = 'localhost'
        configDB['user'] = 'adminODBC'
        configDB['password'] = '1234'
        configDB['database'] = 'odbcViajes'
        configDB['auth_plugin']='mysql_native_password'

    elif(modo == 'produccion'):
        configDB['host'] = 'grcunla.mysql.pythonanywhere-services.com'
        configDB['user'] = 'grcunla'
        configDB['password'] = 'mmyt1234'
        configDB['database'] = 'grcunla$grcdb'
    else:
        configDB['host'] = None
        configDB['user'] = None
        configDB['password'] = None
        configDB['database'] = None

    return configDB