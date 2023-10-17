from flask import Flask, render_template, request, redirect, Response, url_for, session
from flask_mysqldb import MySQL, MySQLdb

app = Flask(__name__, template_folder='template')

# Configuración de la base de datos
app.config['MYSQL_HOST'] = 'database-login.cbirk4gfi5rx.us-east-2.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = '123456789'
app.config['MYSQL_DB'] = 'loginaws'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

# Ruta de inicio
@app.route('/')
def home():
    return render_template('index.html')

# Ruta para acceder al panel de administración
@app.route('/admin')
def admin():
    return render_template('admin.html')

# Ruta para el proceso de inicio de sesión
@app.route('/acceso-login', methods=["GET", "POST"])
def login():
    if request.method == 'POST' and 'txtCorreo' in request.form and 'txtPassword' in request.form:
        _correo = request.form['txtCorreo']
        _password = request.form['txtPassword']

        # Crear un cursor para interactuar con la base de datos
        cur = mysql.connection.cursor()

        # Realizar una consulta SQL para verificar las credenciales
        cur.execute('SELECT * FROM usuarios WHERE id = %s AND clave = %s', (_correo, _password))
        account = cur.fetchone()

        if account:
            # Si las credenciales son válidas, se establece una sesión
            session['logueado'] = True
            session['id'] = account['id']
            return render_template("admin.html")
        else:
            # Si las credenciales son inválidas, se muestra un mensaje de error
            return render_template('index.html', mensaje="Usuario O Contraseña Incorrectas")

# Ruta para el proceso de registro de nuevos usuarios
@app.route('/new-registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST' and 'txtCorreoRegister' in request.form and 'txtPasswordRegister' in request.form:
        _correoRegister = request.form['txtCorreoRegister']
        _passwordRegister = request.form['txtPasswordRegister']

        # Crear un cursor para interactuar con la base de datos
        cur = mysql.connection.cursor()

        # Insertar un nuevo usuario en la base de datos
        cur.execute('INSERT INTO usuarios (id, clave) VALUES (%s, %s)', (_correoRegister, _passwordRegister))
        mysql.connection.commit()
        cur.close()

        # Redirigir al panel de administración después del registro
        return render_template('admin.html')

    # Mostrar el formulario de registro si la solicitud es GET
    return render_template('index.html')

# Configuración de la clave secreta para las sesiones de la aplicación
app.secret_key = "loginseguro"

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)