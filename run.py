from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__, template_folder='app/templates', static_folder='app/static')

# Sample database (replace with your actual user authentication logic)
users = {
    'admin': {
        'password': 'adminpass'
    },
    'customer': {
        'password': 'customerpass'
    }
}

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/', methods=['POST'])
def login_post():
    data = request.get_json()
    username = data['username']
    password = data['password']
    role = data['role']

    if role in users and username == role and password == users[role]['password']:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False}), 401

@app.route('/admin')
def admin_dashboard():
    return render_template('admin.html')

@app.route('/student')
def customer_dashboard():
    return render_template('student.html')

if __name__ == '__main__':
    app.run(debug=True)