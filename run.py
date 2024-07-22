import base64
import bcrypt
from flask import Flask,render_template,request,jsonify
import app.databaseConnection as dbconnect
import face_recognition
import pickle
import pymysql
# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__,template_folder='app/templates', static_folder='app/static')
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.

# obtain the database connection here
connection = dbconnect.ConnectToDb()
cursor = connection.cursor()


def findFace():
    """
    this functions checks whether a face is present in the image or not
    """
    try:
        image = face_recognition.load_image_file("student.png")
        face_locations = face_recognition.face_locations(image)
        print(face_locations)
        if(face_locations==[]):
            return False
        else:
            return True
    except RuntimeError as e:
        print(e)
        return False


def recogniseFace():
    result=[]
    try:
        image = face_recognition.load_image_file("student.png",mode='RGB')
        face_encoding = face_recognition.face_encodings(image)[0]
        if(len(face_encoding)==128):
            result=face_encoding
        else:
            result=[]
        print(result)
        return result
    except:
        result=[]
        return result

def storeStudentDataInDB(first_name,last_name,email,phone,dob,password,faceEncodings):
    #hash the password
    try:
        bytes = password.encode('utf-8') 
        salt = bcrypt.gensalt() 
        hashedPassword = bcrypt.hashpw(bytes, salt)
        #now make image to blob
        binary_image = pickle.dumps(faceEncodings)
        # now insert the data to db
        insert_query = """
                        INSERT INTO students (first_name, last_name, email, phone, password, date_of_birth)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        """
        max_id_query = """
                        SELECT MAX(student_id) FROM students
                        """
        insert_image_query = """
                            INSERT INTO images (student_id, image)
                            VALUES (%s, %s)
                            """
        cursor.execute(insert_query, (first_name,last_name,email,phone,hashedPassword,'2000-01-01'))
        connection.commit()
        cursor.execute(max_id_query)
        student_id = cursor.fetchone()[0]
        cursor.execute(insert_image_query, (student_id, binary_image))
        connection.commit()
        print("Record inserted successfully for student_id:", student_id)
        return True
    except  pymysql.MySQLError as e:
        print(e)
        connection.rollback()
        return False


@app.route('/')
def login():
    return render_template('login.html')

#route for login as admin it checks the validity of admin and then sends the desired response
@app.route('/login-admin',methods=["POST"])
def loginAdmin():
    data = request.get_json()
    username = data["username"]
    password=data["password"]
    #now call the database here to validate these details
    cursor.execute(f"Select * from admins where username='{username}' and password='{password}'")
    queryResult = cursor.fetchall()
    if(queryResult==()):
        response = {
        'status': 400,
        'message': 'Wrong Credentials'
        }
        return jsonify(response)
    else:
        response = {
        'status': 200,
        'message': 'Login Success'
        }
        return jsonify(response)

@app.route('/admin-login')
def renderAdmin():
    return render_template('admin.html')

@app.route('/student-login')
def renderStdudent():
    return render_template('student.html')

@app.route('/register-student')
def renderRegisterStudent():
    return render_template('register_student.html')

# add student to database 
@app.route('/student-register',methods=["POST"])
def registerStudent():
    print("Registering Student")
    data = request.get_json()
    first_name=data["first_name"]
    last_name=data["last_name"]
    email=data["email"]
    password=data["password"]
    phone=data["phone"]
    dob=data["dob"]
    image=data["image"]
    #print(image)
    try:
        if image.startswith('data:image/png;base64,'):
            image = image.replace('data:image/png;base64,', '')
            image_binary = base64.b64decode(image)
            file_path = 'student.png'  
            with open(file_path, 'wb') as f:
                f.write(image_binary)
            hasFace= findFace()
            if hasFace==True:
                faceEncodings = recogniseFace()
                print(len(faceEncodings))
                if(len(faceEncodings) !=128):
                    response = {
                    'status': 400,
                    'message': 'Face Recognition Error'
                    }
                    return jsonify(response)
                else:
                    #db m store kr de
                    result=storeStudentDataInDB(first_name,last_name,email,phone,dob,password,faceEncodings)
                    if(result==True):
                        response = {
                        'status': 200,
                        'message': 'Student Successfully Registered'
                        }
                        return jsonify(response)
                    else:
                        response = {
                        'status': 400,
                        'message': 'Failed To Register'
                        }
                        return jsonify(response)
            else:
                response = {
                'status': 400,
                'message': 'Face Not Found! Kindly Capture Once Again'
                }
            return jsonify(response)

        else:
            response = {
                'status': 400,
                'message': 'Image Path Error'
                }
            return jsonify(response)
    except RuntimeError as e:
        print(e)
        response = {
                'status': 400,
                'message': 'Internal Server Error'
                }
        return jsonify(response)


@app.route('/login-student',methods=["POST"])
def loginStudent():
    data = request.get_json()
    username = data["email"]
    password=data["password"]
    #now call the database here to validate these details
    cursor.execute(f"Select * from students where email='{username}'")
    queryResult = cursor.fetchone()
    print(queryResult)
    if(queryResult==()):
        response = {
        'status': 400,
        'message': 'Wrong Credentials'
        }
        return jsonify(response)
    else:
        #use hashing logic and then verify the password
        hashedPassword = queryResult[5] #the hashed password which is stored in db
        """
        Implement the hashing logic here and then send the desired response
        if password does not match then send: response = {
                                                'status': 400,
                                                'message': 'Wrong Credentials'
                                                } 
        otherwise for a match send: response = {
                                        'status': 200,
                                        'message': 'Login Success'
                                        }
        """
        bytes = password.encode('utf-8') 
        hash_bytes=hashedPassword.encode('utf-8')
        if bcrypt.checkpw(bytes,hash_bytes):
            response = {
                'status': 200,
                'message': 'Login Success'
            }
        else:
            response = {
                'status': 400,
                'message': 'Wrong Credentials'
            }
        
        return jsonify(response)


# main driver function
if __name__ == '__main__':
    app.run(debug=True)