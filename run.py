
import bcrypt
from flask import Flask,render_template,request,jsonify
import app.databaseConnection as dbconnect

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__,template_folder='app/templates', static_folder='app/static')
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.

# obtain the database connection here
connection = dbconnect.ConnectToDb()
cursor = connection.cursor()


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

@app.route('/register-student')
def renderRegisterStudent():
    return render_template('register_student.html')

# add student to database 
@app.route('/student-register')
def registerStudent():
    print("Registering Student")
    
    

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
        # generating the salt 
        salt = bcrypt.gensalt() 
        # Hashing the password 
        hash = bcrypt.hashpw(bytes, salt) 
        if bcrypt.checkpw(hash, hashedPassword.encode('utf-8')):
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