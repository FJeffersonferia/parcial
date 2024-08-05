from flask import Flask, request, jsonify, session, send_from_directory
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime, timedelta
from functools import wraps
import jwt

app = Flask(__name__)

# Configuración de CORS
CORS(app)

# Configuración de la base de datos
app.config['MYSQL_HOST'] = 'bqwn1vw92k8c82ongzjd-mysql.services.clever-cloud.com'
app.config['MYSQL_USER'] = 'uvhjqoxdtewm1p5s'
app.config['MYSQL_PASSWORD'] = 'HuQzgDBd4rCZBx6257Ds'
app.config['MYSQL_DB'] = 'bqwn1vw92k8c82ongzjd'
mysql = MySQL(app)

app.secret_key = "mysecretkey"



# Verificar autenticación
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Función para consultar todos los registros
@app.route('/getAll', methods=['GET'])
def getAll():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'id': result[0],
                'Cedula': result[3],
                'Nombre': result[1],
                'Apellido': result[2],
                'Email': result[4],
                'Usuario': result[5],
                'Contraseña': result[6],
                'Rol': result[7],
                'Telefono': result[9],
                'Edad': result[8]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Asegúrate de que el método de inicio de sesión esté configurado correctamente
@app.route('/loginT', methods=['GET'])
def login():
    try:
        Usu = request.json.get('username')
        Con = request.json.get('password')
        print(Usu,Con)
        if not Usu or not Con:
            return jsonify({'success': False, 'message': 'Campos incompletos'}), 400

        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM usuarios WHERE Usuario=%s AND Contraseña=%s', (Usu, Con))
        account = cur.fetchone()
        print(account)
        cur.close()

        if account:
            token = jwt.encode({
                'id': account[0],
                'Nombre': account[1],
                'Apellido': account[2],
                'ID_Cargo': account[7],
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }, app.secret_key, algorithm="HS256")

            return jsonify({'token':token
            })
        else:
            return jsonify({'success': False, 'message': 'Usuario o contraseña incorrectos'}), 401
    except Exception as e:
        print(f"Error en login: {str(e)}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


# Verificación de token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(*args, **kwargs)

    return decorated

# Ruta protegida
@app.route('/protected', methods=['GET'])
@token_required
def protected_route():
    return jsonify({'message': 'This is a protected route.'})

# Función para consultar un registro por ID
@app.route('/getAllById/<ID>', methods=['GET'])
def getAllById(ID):
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users WHERE id = %s', (ID,))
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'id': result[0],
                'Cedula': result[3],
                'Nombre': result[1],
                'Apellido': result[2],
                'Email': result[4],
                'Usuario': result[5],
                'Contraseña': result[6],
                'Rol': result[7],
                'Telefono': result[9],
                'Edad': result[8]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Ruta para obtener informes del usuario autenticado
@app.route('/getReports', methods=['GET'])
def get_reports():
    user_id = session['user_id']
    
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM informes WHERE user_id = %s', (user_id,))
    reports = cur.fetchall()
    cur.close()
    
    return jsonify(reports)

# Función para consultar el conteo de registros
@app.route('/getcount', methods=['GET'])
def getcount():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT COUNT(*) as total from users')
        rv = cur.fetchall()
        cur.close()
        payload = [{'total': result[0]} for result in rv]
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": e})

# Función para crear un registro
@app.route('/add_users', methods=['POST'])
def add_users():
    try:
        data = request.get_json()
        cedula = data['cedula']
        nombre = data['nombre']
        apellido = data['apellido']
        email = data['email']
        username = data['username']
        password = data['password']
        rol = data['rol']
        edad = data['edad']
        telefono = data['telefono']

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO users (Cedula, Nombre, Apellido, Email, Usuario, Contraseña, Rol, Telefono, Edad) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (cedula, nombre, apellido, email, username, password, rol, telefono, edad)
        )
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Usuario agregado exitosamente'}), 201
    except Exception as e:
        print("Error al agregar usuario:", str(e))
        return jsonify({'message': 'Error al agregar usuario', 'error': str(e)}), 500

# Función para actualizar un registro
@app.route('/update/<id>', methods=['PUT'])
def update_user(id):
    try:
        cedula = request.json['Cedula']
        nombre = request.json['Nombre']
        apellido = request.json['Apellido']
        email = request.json['Email']
        usuario = request.json['Usuario']
        contraseña = request.json['Contraseña']
        rol = request.json['Rol']
        telefono = request.json['Telefono']
        edad = request.json['Edad']
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE users
            SET Cedula = %s,
                Nombre = %s,
                Apellido = %s,
                Email = %s,
                Usuario = %s,
                Contraseña = %s,
                Rol = %s,
                Telefono = %s,
                Edad = %s
            WHERE id = %s
        """, (cedula, nombre, apellido, email, usuario, contraseña, rol, telefono, edad, id))
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Registro actualizado"})
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para eliminar un registro
@app.route('/delete/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM users WHERE id = %s', (id,))
        mysql.connection.commit()
        return jsonify({"informacion": "Registro eliminado"})
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para obtener casos del usuario logueado
@app.route('/getMyCases', methods=['GET'])
def get_my_cases():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT 
                c.ID_caso, 
                c.Descripcion, 
                c.Identificacion_caso, 
                c.Tipo_problema, 
                c.Estado, 
                c.Fecha_registro, 
                e.nombre AS EstudianteNombre, 
                i.Nombre_institucion AS InstitucionNombre
            FROM casos c
            JOIN estudiantes e ON c.ID_usuario = e.ID_estudiante
            JOIN institucion i ON c.ID_institucion = i.ID
        ''')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'ID': result[0],
                'descripcion': result[1],
                'identificacion': result[2],
                'tipo': result[3],
                'estado': result[4],
                'fecha': result[5],
                'usuario': result[6],
                'institucion': result[7]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Ruta para obtener casos por estudiante
@app.route('/get_cases/<estudiante_id>', methods=['GET'])
def get_cases(estudiante_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT c.ID_caso, c.Descripcion, c.Identificacion_caso, c.Tipo_problema, c.Estado, c.Fecha_registro, e.Cedula, e.nombre, c.ID_institucion
            FROM casos c
            JOIN estudiantes e ON c.ID_usuario = e.ID_estudiante
            WHERE e.ID_estudiante = %s
        ''', (estudiante_id,))
        casos = cur.fetchall()
        cur.close()
        payload = []
        for caso in casos:
            content = {
                'ID_caso': caso[0],
                'Descripcion': caso[1],
                'Identificacion_caso': caso[2],
                'Tipo_problema': caso[3],
                'Estado': caso[4],
                'Fecha_registro': caso[5],
                'Cedula': caso[6],
                'Nombre': caso[7],
                'ID_institucion': caso[8]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Función para crear un estudiante
@app.route('/add_estudiante', methods=['POST'])
def add_estudiante():
    try:
        data = request.get_json()
        cedula = data['cedula']
        nombre = data['nombre']
        apellido = data['apellido']
        email = data['email']
        username = data['username']
        password = data['password']
        edad = data['edad']
        telefono = data['telefono']
        genero = data['genero']
        grado = data['grado']
        curso = data['curso']

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO estudiantes (Cedula, nombre, apellido, Email, Users, password, Edad, Telefono, genero, Grado, Curso) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (cedula, nombre, apellido, email, username, password, edad, telefono, genero, grado, curso)
        )
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Estudiante agregado exitosamente'}), 201
    except Exception as e:
        print("Error al agregar estudiante:", str(e))
        return jsonify({'message': 'Error al agregar estudiante', 'error': str(e)}), 500

# Función para actualizar un estudiante
@app.route('/update_estudiante/<id>', methods=['PUT'])
def update_estudiante(id):
    try:
        data = request.get_json()
        cedula = data['cedula']
        nombre = data['nombre']
        apellido = data['apellido']
        email = data['email']
        username = data['username']
        password = data['password']
        edad = data['edad']
        telefono = data['telefono']
        genero = data['genero']
        grado = data['grado']
        curso = data['curso']

        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE estudiantes
            SET Cedula = %s,
                nombre = %s,
                apellido = %s,
                Email = %s,
                Users = %s,
                password = %s,
                Edad = %s,
                Telefono = %s,
                genero = %s,
                Grado = %s,
                Curso = %s
            WHERE ID_estudiante = %s
        """, (cedula, nombre, apellido, email, username, password, edad, telefono, genero, grado, curso, id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Estudiante actualizado exitosamente'}), 200
    except Exception as e:
        print("Error al actualizar estudiante:", str(e))
        return jsonify({'message': 'Error al actualizar estudiante', 'error': str(e)}), 500

# Función para obtener todos los estudiantes
@app.route('/getAllStudents', methods=['GET'])
def getAllStudents():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM estudiantes')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'ID_estudiante': result[0],
                'Cedula': result[1],
                'nombre': result[2],
                'apellido': result[3],
                'Email': result[4],
                'Users': result[5],
                'password': result[6],
                'Edad': result[7],
                'Telefono': result[8],
                'genero': result[9],
                'Grado': result[10],
                'Curso': result[11]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para eliminar un estudiante
@app.route('/deleteStudent/<id>', methods=['DELETE'])
def delete_student(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM estudiantes WHERE ID_estudiante = %s', (id,))
        mysql.connection.commit()
        return jsonify({"informacion": "Estudiante eliminado"})
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para obtener todas las instituciones
@app.route('/getInstituciones', methods=['GET'])
def get_instituciones():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM institucion')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'ID': result[0],
                'Fecha_creacion': result[1],
                'Nombre_institucion': result[2],
                'Ubicacion': result[3]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para consultar los géneros
@app.route('/getGeneros', methods=['GET'])
def getGeneros():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM generos')
        rv = cur.fetchall()
        cur.close()
        payload = [{'genero': result[0], 'Descripcion': result[1]} for result in rv]
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para consultar los grados
@app.route('/getGrados', methods=['GET'])
def getGrados():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM grados')
        rv = cur.fetchall()
        cur.close()
        payload = [{'Id_curso': result[0], 'Descripcion': result[1]} for result in rv]
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para consultar los cursos
@app.route('/getCursos', methods=['GET'])
def getCursos():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM cursos')
        rv = cur.fetchall()
        cur.close()
        payload = [{'Id_curso': result[0], 'Descripcion': result[1]} for result in rv]
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para crear una institución
@app.route('/add_institucion', methods=['POST'])
def add_institucion():
    try:
        data = request.get_json()
        nombre_institucion = data['nombre_institucion']
        ubicacion = data['ubicacion']
        fecha_creacion = data['fecha_creacion']

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO institucion (Nombre_institucion, Ubicacion, Fecha_creacion) VALUES (%s, %s, %s)",
            (nombre_institucion, ubicacion, fecha_creacion)
        )
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Institución agregada exitosamente'}), 201
    except Exception as e:
        print("Error al agregar institución:", str(e))
        return jsonify({'message': 'Error al agregar institución', 'error': str(e)}), 500

# Ruta para servir archivos estáticos
@app.route('/<path:path>')
def static_file(path):
    return send_from_directory('static', path)

# Función para obtener todas las edades de los estudiantes
@app.route('/get_ages', methods=['GET'])
def get_ages():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT Edad FROM estudiantes')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            payload.append(result[0])
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para obtener tipos de problema
@app.route('/get_problem', methods=['GET'])
def get_problem():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT Tipo_problema FROM casos')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            payload.append(result[0])
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

# Función para obtener casos por institución
@app.route('/get_casosI', methods=['GET'])
def get_casos_por_institucion():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT institucion.Nombre_institucion, COUNT(casos.ID_caso) as num_casos
            FROM casos
            JOIN institucion ON casos.ID_institucion = institucion.ID
            GROUP BY institucion.Nombre_institucion
        ''')
        rv = cur.fetchall()
        cur.close()
        
        payload = [{'institucion': result[0], 'num_casos': result[1]} for result in rv]
        
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

@app.route('/add_intervenciones', methods=['POST'])
def crear_intervencion():
    try:
        data = request.get_json()
        fecha = data.get('fecha')
        hora = data.get('hora')  # Asegúrate de recibir el campo 'hora'
        estudiante = data.get('estudiante')
        descripcion = data.get('descripcion')
        tipo = data.get('tipo')

        # Validar los datos recibidos
        if not (fecha and hora and estudiante and descripcion and tipo):
            return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

        # Concatenar fecha y hora en un solo campo de tipo datetime
        fecha_hora = f"{fecha} {hora}"

        cur = mysql.connection.cursor()
        cur.execute('''
            INSERT INTO intervencion (Fecha, Hora, ID_estudiante, Descripcion, Tipo_de_intervencion)
            VALUES (%s, %s, %s, %s, %s)
        ''', (fecha_hora, estudiante, descripcion, tipo))
        mysql.connection.commit()
        cur.close()

        return jsonify({'success': True, 'message': 'Intervención creada exitosamente'})
    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/get_intervenciones', methods=['GET'])
def obtener_intervenciones():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT 
                i.ID_intervencion, 
                i.Fecha, 
                i.ID_estudiante, 
                e.nombre AS estudiante, 
                i.Descripcion, 
                i.Tipo_de_intervencion 
            FROM intervencion i
            JOIN estudiantes e ON i.ID_estudiante = e.ID_estudiante
        ''')
        intervenciones = cur.fetchall()
        cur.close()

        payload = []
        for intervencion in intervenciones:
            content = {
                'id_intervencion': intervencion[0],
                'Fecha': intervencion[1],
                'estudiante': intervencion[3],
                'intervencion': intervencion[4],
                'detalle': intervencion[5]
            }
            payload.append(content)

        return jsonify(payload)
    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor', 'error': str(e)}), 500

#Funcion para recibir profesores
@app.route('/getpro', methods=['GET'])
def getpro():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM profesores')
        rv = cur.fetchall()
        cur.close()
        payload = []
        for result in rv:
            content = {
                'id': result[0],
                'nombre': result[3],
                'apellido': result[1],
                'identificacion': result[2],
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

if __name__ == "__main__":
    app.run(port=3000, debug=True)
