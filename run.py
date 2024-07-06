from flask import Flask,render_template

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__,template_folder='app/templates', static_folder='app/static')
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/')
def hello_world():
    return render_template("./login.html")

# main driver function
if __name__ == '__main__':
    app.run(debug=True)