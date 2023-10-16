from flask import Flask
from flask import render_template, request, redirect, Response, url_for, session
from flask_mysqldb import MySQL,MySQLdb # pip install Flask-MySQLdb
 
app = Flask(__name__,template_folder='template')

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456789'
app.config['MYSQL_DB'] = 'loginexample'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

@app.route('/')
def home():
    return render_template('index.html')   

@app.route('/admin')
def admin():
    return render_template('admin.html')   

@app.route('/acceso-login', methods= ["GET", "POST"])

def login():
   
    if request.method == 'POST' and 'txtCorreo' in request.form and 'txtPassword' in request.form:
       
        _correo = request.form['txtCorreo']
        _password = request.form['txtPassword']

        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM usuarios WHERE id = %s AND clave = %s', (_correo, _password,))
        account = cur.fetchone()
      
        if account:
            session['logueado'] = True
            session['id'] = account['id']

            return render_template("admin.html")
        else:
            return render_template('index.html',mensaje="Usuario O Contraseña Incorrectas")

@app.route('/new-registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST' and 'txtCorreoRegister' in request.form and 'txtPasswordRegister' in request.form:
        _correoRegister = request.form['txtCorreoRegister']
        _passwordRegister = request.form['txtPasswordRegister']

        cur = mysql.connection.cursor()
        cur.execute('INSERT INTO usuarios (id, clave) VALUES (%s, %s)', (_correoRegister, _passwordRegister))
        mysql.connection.commit()
        cur.close()

        return render_template('admin.html')
    
       


    
if __name__ == '__main__':
   app.secret_key = "loginseguro"
   app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)